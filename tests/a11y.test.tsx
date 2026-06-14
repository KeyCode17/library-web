import { screen } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"
import * as axeMatchers from "vitest-axe/matchers"
import { setToken } from "#/libs/auth/token-store.ts"
import { makeBook, makeBookList } from "./mocks/books.ts"
import { makeLoan, makeLoanList } from "./mocks/loans.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

expect.extend(axeMatchers)

const me = {
	id: "11111111-1111-4111-8111-111111111111",
	email: "me@example.com",
	role: "member",
} as const
const BOOK_ID = "00000000-0000-4000-8000-000000000001"

function booksHandler() {
	return http.get("*/api/books", () =>
		HttpResponse.json(
			makeBookList([makeBook({ id: BOOK_ID, title: "Clean Code", shelf: "Tech" })]),
		),
	)
}
function meHandler() {
	return http.get("*/api/auth/me", () => HttpResponse.json(me))
}

async function assertNoViolations() {
	// color-contrast needs a real layout engine (canvas); it's verified in the
	// Playwright (real-browser) axe pass instead.
	const results = await axe(document.body, {
		rules: { "color-contrast": { enabled: false } },
	})
	expect(results).toHaveNoViolations()
}

describe("accessibility (axe)", () => {
	it("login screen has no violations", async () => {
		renderRoute("/auth/login")
		await screen.findByRole("heading", { name: "Sign in" })
		await assertNoViolations()
	})

	it("register screen has no violations", async () => {
		renderRoute("/auth/register")
		await screen.findByRole("heading", { name: "Create account" })
		await assertNoViolations()
	})

	it("catalog screen has no violations", async () => {
		server.use(booksHandler())
		renderRoute("/catalog")
		await screen.findByRole("heading", { name: "Clean Code" })
		await assertNoViolations()
	})

	it("book detail screen has no violations", async () => {
		server.use(
			http.get("*/api/books/:id", () =>
				HttpResponse.json(makeBook({ id: BOOK_ID, title: "Clean Code" })),
			),
		)
		renderRoute(`/books/${BOOK_ID}`)
		await screen.findByRole("heading", { level: 1, name: "Clean Code" })
		await assertNoViolations()
	})

	it("account screen has no violations", async () => {
		setToken("jwt")
		server.use(meHandler())
		renderRoute("/account")
		await screen.findByRole("heading", { level: 1, name: "Account" })
		await assertNoViolations()
	})

	it("loans screen has no violations", async () => {
		setToken("jwt")
		server.use(
			http.get("*/api/loans", () =>
				HttpResponse.json(makeLoanList([makeLoan({ book_id: BOOK_ID, status: "borrowed" })])),
			),
			booksHandler(),
			meHandler(),
		)
		renderRoute("/loans")
		await screen.findByRole("heading", { level: 1, name: "My loans" })
		await assertNoViolations()
	})

	it("recommendations screen has no violations", async () => {
		server.use(booksHandler())
		renderRoute("/recommend")
		await screen.findByRole("heading", { level: 1, name: "Recommendations" })
		await assertNoViolations()
	})

	it("chat room picker has no violations", async () => {
		setToken("jwt")
		server.use(booksHandler(), meHandler())
		renderRoute("/chat")
		await screen.findByRole("heading", { level: 1, name: "Chat rooms" })
		await assertNoViolations()
	})
})
