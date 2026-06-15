import { fireEvent, screen, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { clearToken, setToken } from "#/libs/auth/token-store.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

const ME = {
	id: "11111111-1111-4111-8111-111111111111",
	email: "me@example.com",
	role: "member",
	verified: true,
	active: true,
}

const CHANGE_PW_URL = "*/api/auth/change-password"

beforeEach(() => setToken("jwt"))
afterEach(() => clearToken())

async function changePasswordSection() {
	const heading = await screen.findByRole("heading", { name: "Change password" })
	return within(heading.closest("section") as HTMLElement)
}

describe("account self-service", () => {
	it("changes the password (success)", async () => {
		server.use(
			http.get("*/api/auth/me", () => HttpResponse.json(ME)),
			http.post(CHANGE_PW_URL, () => new HttpResponse(null, { status: 204 })),
		)

		renderRoute("/account")
		await screen.findByRole("heading", { level: 1, name: "Account" })
		const section = await changePasswordSection()
		fireEvent.change(section.getByLabelText("Current password"), {
			target: { value: "oldpassword" },
		})
		fireEvent.change(section.getByLabelText("New password"), { target: { value: "password123" } })
		fireEvent.click(section.getByRole("button", { name: /update password/i }))

		expect(await section.findByText(/password changed/i)).toBeInTheDocument()
	})

	it("shows an error on the wrong current password", async () => {
		server.use(
			http.get("*/api/auth/me", () => HttpResponse.json(ME)),
			http.post(CHANGE_PW_URL, () =>
				HttpResponse.json(
					{ code: "invalid_credentials", message: "Current password is incorrect" },
					{ status: 401 },
				),
			),
		)

		renderRoute("/account")
		await screen.findByRole("heading", { level: 1, name: "Account" })
		const section = await changePasswordSection()
		fireEvent.change(section.getByLabelText("Current password"), { target: { value: "wrongpass" } })
		fireEvent.change(section.getByLabelText("New password"), { target: { value: "password123" } })
		fireEvent.click(section.getByRole("button", { name: /update password/i }))

		expect(await section.findByText(/current password is incorrect/i)).toBeInTheDocument()
	})

	it("shows the unverified-email banner when verified is false", async () => {
		server.use(http.get("*/api/auth/me", () => HttpResponse.json({ ...ME, verified: false })))

		renderRoute("/account")

		expect(await screen.findByText(/isn't verified yet/i)).toBeInTheDocument()
	})
})
