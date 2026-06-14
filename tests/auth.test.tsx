import { fireEvent, screen } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { setToken } from "#/libs/auth/token-store.ts"
import { makeBookList } from "./mocks/books.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

const LOGIN_URL = "*/api/auth/login"
const REGISTER_URL = "*/api/auth/register"
const ME_URL = "*/api/auth/me"
const BOOKS_URL = "*/api/books"

const EMAIL = "reader@example.com"
const PASSWORD = "password123"

function fillCredentials() {
	fireEvent.change(screen.getByLabelText("Email"), { target: { value: EMAIL } })
	fireEvent.change(screen.getByLabelText("Password"), { target: { value: PASSWORD } })
}

const principal = {
	id: "11111111-1111-4111-8111-111111111111",
	email: EMAIL,
	role: "member",
} as const

describe("auth", () => {
	it("renders the login form", async () => {
		renderRoute("/auth/login")
		expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument()
		expect(screen.getByLabelText("Email")).toBeInTheDocument()
		expect(screen.getByLabelText("Password")).toBeInTheDocument()
		expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
	})

	it("logs in, attaches the bearer token, and reaches the account page", async () => {
		let seenAuth: string | null = null
		server.use(
			http.post(LOGIN_URL, () =>
				HttpResponse.json({ token: "test-jwt", token_type: "Bearer", expires_in: 3600 }),
			),
			http.get(ME_URL, ({ request }) => {
				seenAuth = request.headers.get("authorization")
				return HttpResponse.json(principal)
			}),
		)

		renderRoute("/auth/login")
		await screen.findByRole("heading", { name: "Sign in" })
		fillCredentials()
		fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

		// navigated to the guarded account page, which renders the live principal
		expect(await screen.findByRole("heading", { level: 1, name: "Account" })).toBeInTheDocument()
		expect((await screen.findAllByText(EMAIL)).length).toBeGreaterThanOrEqual(1)
		expect(seenAuth).toBe("Bearer test-jwt")
	})

	it("shows an error on invalid credentials (401)", async () => {
		server.use(
			http.post(LOGIN_URL, () =>
				HttpResponse.json(
					{ code: "invalid_credentials", message: "Invalid email or password" },
					{ status: 401 },
				),
			),
		)

		renderRoute("/auth/login")
		await screen.findByRole("heading", { name: "Sign in" })
		fillCredentials()
		fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

		expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
		// still on the login screen
		expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument()
	})

	it("registers, then lands authenticated on the account page", async () => {
		server.use(
			http.post(REGISTER_URL, () => HttpResponse.json(principal, { status: 201 })),
			http.post(LOGIN_URL, () =>
				HttpResponse.json({ token: "test-jwt", token_type: "Bearer", expires_in: 3600 }),
			),
			http.get(ME_URL, () => HttpResponse.json(principal)),
		)

		renderRoute("/auth/register")
		await screen.findByRole("heading", { name: "Create account" })
		fillCredentials()
		fireEvent.click(screen.getByRole("button", { name: /create account/i }))

		expect(await screen.findByRole("heading", { level: 1, name: "Account" })).toBeInTheDocument()
		expect((await screen.findAllByText(EMAIL)).length).toBeGreaterThanOrEqual(1)
	})

	it("logs out back to the anonymous state", async () => {
		setToken("test-jwt")
		server.use(
			http.get(ME_URL, () => HttpResponse.json(principal)),
			http.get(BOOKS_URL, () => HttpResponse.json(makeBookList([]))),
		)

		renderRoute("/catalog")
		// signed-in: the app bar shows the principal's email
		expect(await screen.findByText(EMAIL)).toBeInTheDocument()

		fireEvent.click(screen.getByRole("button", { name: /log out/i }))

		// back to anonymous: login affordance returns, email gone
		expect(await screen.findByRole("link", { name: /log in/i })).toBeInTheDocument()
		expect(screen.queryByText(EMAIL)).not.toBeInTheDocument()
	})
})
