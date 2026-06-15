import { fireEvent, screen } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

describe("forgot password", () => {
	it("always shows a neutral confirmation", async () => {
		server.use(
			http.post("*/api/auth/forgot-password", () => new HttpResponse(null, { status: 202 })),
		)

		renderRoute("/auth/forgot-password")
		fireEvent.change(await screen.findByLabelText("Email"), {
			target: { value: "someone@example.com" },
		})
		fireEvent.click(screen.getByRole("button", { name: /send reset link/i }))

		expect(await screen.findByText(/if an account exists/i)).toBeInTheDocument()
	})
})

describe("reset password", () => {
	function resetHandler() {
		return http.post("*/api/auth/reset-password", async ({ request }) => {
			const body = (await request.json()) as { token: string }
			return body.token === "good-token"
				? new HttpResponse(null, { status: 204 })
				: HttpResponse.json({ code: "invalid_token", message: "expired" }, { status: 400 })
		})
	}

	it("reads the token and resets on success", async () => {
		server.use(resetHandler())
		renderRoute("/auth/reset-password?token=good-token")
		fireEvent.change(await screen.findByLabelText("New password"), {
			target: { value: "password123" },
		})
		fireEvent.click(screen.getByRole("button", { name: /reset password/i }))

		expect(await screen.findByText(/your password has been reset/i)).toBeInTheDocument()
	})

	it("shows an error on an expired token", async () => {
		server.use(resetHandler())
		renderRoute("/auth/reset-password?token=bad-token")
		fireEvent.change(await screen.findByLabelText("New password"), {
			target: { value: "password123" },
		})
		fireEvent.click(screen.getByRole("button", { name: /reset password/i }))

		expect(await screen.findByRole("alert")).toBeInTheDocument()
	})
})

describe("verify email", () => {
	function verifyHandler() {
		return http.post("*/api/auth/verify-email", async ({ request }) => {
			const body = (await request.json()) as { token: string }
			return body.token === "good-token"
				? new HttpResponse(null, { status: 204 })
				: HttpResponse.json({ code: "invalid_token", message: "expired" }, { status: 400 })
		})
	}

	it("verifies on a good token", async () => {
		server.use(verifyHandler())
		renderRoute("/auth/verify-email?token=good-token")
		expect(await screen.findByRole("heading", { name: /email verified/i })).toBeInTheDocument()
	})

	it("shows expired on a bad token", async () => {
		server.use(verifyHandler())
		renderRoute("/auth/verify-email?token=bad-token")
		expect(await screen.findByRole("heading", { name: /link expired/i })).toBeInTheDocument()
	})
})
