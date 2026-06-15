import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { beforeEach, describe, expect, it } from "vitest"
import { server } from "./mocks/server.ts"
import { makeUser, makeUserList } from "./mocks/users.ts"
import { renderRoute } from "./utils.tsx"

const ADMIN = makeUser({
	id: "00000000-0000-4000-b000-000000000001",
	email: "admin@example.com",
	role: "admin",
})
const MEMBER = makeUser({
	id: "00000000-0000-4000-b000-000000000002",
	email: "bob@example.com",
	role: "member",
})

// In-memory user store the MSW handlers mutate, so refetches reflect changes.
let users: ReturnType<typeof makeUser>[] = []
let lastRoleAssign: { id: string; role: string } | null = null

function meHandler(role: "admin" | "member") {
	return http.get("*/api/auth/me", () =>
		HttpResponse.json({ ...(role === "admin" ? ADMIN : MEMBER) }),
	)
}

function userHandlers() {
	return [
		http.get("*/api/users", () => HttpResponse.json(makeUserList(users))),
		http.post("*/api/users", async ({ request }) => {
			const body = (await request.json()) as {
				email: string
				role: "admin" | "librarian" | "member"
			}
			const created = makeUser({ email: body.email, role: body.role })
			users = [...users, created]
			return HttpResponse.json(created, { status: 201 })
		}),
		http.post("*/api/users/:id/roles", async ({ params, request }) => {
			const body = (await request.json()) as { role: "admin" | "librarian" | "member" }
			lastRoleAssign = { id: String(params.id), role: body.role }
			users = users.map((u) => (u.id === params.id ? { ...u, role: body.role } : u))
			return HttpResponse.json({ ...ADMIN })
		}),
		http.delete("*/api/users/:id", ({ params }) => {
			users = users.filter((u) => u.id !== params.id)
			return new HttpResponse(null, { status: 204 })
		}),
	]
}

beforeEach(() => {
	users = [ADMIN, MEMBER]
	lastRoleAssign = null
})

describe("admin manage users", () => {
	it("redirects a non-admin away from the screen", async () => {
		server.use(meHandler("member"), ...userHandlers())
		renderRoute("/admin/users")
		// the admin beforeLoad redirects to /account
		expect(await screen.findByRole("heading", { level: 1, name: "Account" })).toBeInTheDocument()
		expect(screen.queryByRole("heading", { name: "Manage users" })).not.toBeInTheDocument()
	})

	it("renders the user list for an admin", async () => {
		server.use(meHandler("admin"), ...userHandlers())
		renderRoute("/admin/users")
		expect(
			await screen.findByRole("heading", { level: 1, name: "Manage users" }),
		).toBeInTheDocument()
		// the email is rendered in an editable input
		expect(await screen.findByDisplayValue("bob@example.com")).toBeInTheDocument()
	})

	it("assigns a role via the row select", async () => {
		server.use(meHandler("admin"), ...userHandlers())
		renderRoute("/admin/users")
		const select = await screen.findByLabelText("Role for bob@example.com")
		fireEvent.change(select, { target: { value: "librarian" } })
		await waitFor(() => expect(lastRoleAssign).toEqual({ id: MEMBER.id, role: "librarian" }))
		await waitFor(() =>
			expect((screen.getByLabelText("Role for bob@example.com") as HTMLSelectElement).value).toBe(
				"librarian",
			),
		)
	})

	it("creates a user", async () => {
		server.use(meHandler("admin"), ...userHandlers())
		renderRoute("/admin/users")
		await screen.findByRole("heading", { level: 1, name: "Manage users" })

		const createForm = screen.getByRole("heading", { name: "Create user" }).closest("section")
		const form = within(createForm as HTMLElement)
		fireEvent.change(form.getByLabelText("Email"), { target: { value: "carol@example.com" } })
		fireEvent.change(form.getByLabelText("Password"), { target: { value: "password123" } })
		fireEvent.click(form.getByRole("button", { name: /create user/i }))

		expect(await screen.findByDisplayValue("carol@example.com")).toBeInTheDocument()
	})

	it("deletes a user", async () => {
		server.use(meHandler("admin"), ...userHandlers())
		renderRoute("/admin/users")
		const row = (await screen.findByDisplayValue("bob@example.com")).closest("tr")
		const rowScope = within(row as HTMLElement)
		fireEvent.click(rowScope.getByText("Delete"))
		fireEvent.click(rowScope.getByRole("button", { name: /confirm delete/i }))
		await waitFor(() =>
			expect(screen.queryByDisplayValue("bob@example.com")).not.toBeInTheDocument(),
		)
	})
})
