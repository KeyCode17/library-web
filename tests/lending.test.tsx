import { fireEvent, screen, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { makeBook, makeBookList } from "./mocks/books.ts"
import { makeLoan, makeLoanList } from "./mocks/loans.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

const BOOK_ID = "00000000-0000-4000-8000-000000000001"
const LOAN_ID = "00000000-0000-4000-9000-000000000001"
const member = { id: "u-member", email: "member@example.com", role: "member" } as const
const staff = { id: "u-staff", email: "lib@example.com", role: "librarian" } as const

describe("lending — borrow (detail)", () => {
	it("borrows an available book and reflects it going on loan", async () => {
		let available = true
		server.use(
			http.get("*/api/books/:id", () =>
				HttpResponse.json(makeBook({ id: BOOK_ID, title: "Clean Code", available })),
			),
			http.post("*/api/loans", () => {
				available = false
				return HttpResponse.json(makeLoan({ book_id: BOOK_ID }), { status: 201 })
			}),
			http.get("*/api/auth/me", () => HttpResponse.json(member)),
		)

		renderRoute(`/books/${BOOK_ID}`)
		fireEvent.click(await screen.findByRole("button", { name: "Borrow" }))

		// after the loan opens, the refreshed book shows as on loan
		expect(await screen.findByRole("button", { name: "On loan" })).toBeDisabled()
	})

	it("shows a 409 when the book is already on loan", async () => {
		server.use(
			http.get("*/api/books/:id", () =>
				HttpResponse.json(makeBook({ id: BOOK_ID, title: "Clean Code", available: true })),
			),
			http.post("*/api/loans", () =>
				HttpResponse.json(
					{ code: "conflict", message: "This book is already on loan" },
					{ status: 409 },
				),
			),
			http.get("*/api/auth/me", () => HttpResponse.json(member)),
		)

		renderRoute(`/books/${BOOK_ID}`)
		fireEvent.click(await screen.findByRole("button", { name: "Borrow" }))

		expect(await screen.findByText(/already on loan/i)).toBeInTheDocument()
	})

	it("requires login to borrow (401 prevention)", async () => {
		server.use(
			http.get("*/api/books/:id", () =>
				HttpResponse.json(makeBook({ id: BOOK_ID, title: "Clean Code", available: true })),
			),
		)

		renderRoute(`/books/${BOOK_ID}`)
		await screen.findByRole("heading", { level: 1, name: "Clean Code" })

		expect(screen.getByRole("link", { name: /log in to borrow/i })).toBeInTheDocument()
		expect(screen.queryByRole("button", { name: "Borrow" })).not.toBeInTheDocument()
	})
})

describe("lending — my loans", () => {
	function mockLoans(
		loans: ReturnType<typeof makeLoan>[],
		principal: typeof member | typeof staff,
	) {
		server.use(
			http.get("*/api/loans", () => HttpResponse.json(makeLoanList(loans))),
			http.get("*/api/books", () =>
				HttpResponse.json(makeBookList([makeBook({ id: BOOK_ID, title: "Clean Code" })])),
			),
			http.get("*/api/auth/me", () => HttpResponse.json(principal)),
		)
	}

	it("renders loans with status and due date", async () => {
		mockLoans([makeLoan({ id: LOAN_ID, book_id: BOOK_ID, status: "borrowed" })], member)

		renderRoute("/loans")

		expect(await screen.findByRole("heading", { level: 1, name: "My loans" })).toBeInTheDocument()
		const row = await screen.findByRole("article")
		expect(within(row).getByRole("heading", { name: "Clean Code" })).toBeInTheDocument()
		expect(within(row).getByText("Borrowed")).toBeInTheDocument()
		expect(within(row).getByText(/Due 2030-06-28/)).toBeInTheDocument()
		expect(within(row).getByRole("button", { name: "Return" })).toBeInTheDocument()
	})

	it("returns a borrowed loan", async () => {
		let status: "borrowed" | "returned" = "borrowed"
		server.use(
			http.get("*/api/loans", () =>
				HttpResponse.json(makeLoanList([makeLoan({ id: LOAN_ID, book_id: BOOK_ID, status })])),
			),
			http.post("*/api/loans/:id/return", () => {
				status = "returned"
				return HttpResponse.json(makeLoan({ id: LOAN_ID, book_id: BOOK_ID, status: "returned" }))
			}),
			http.get("*/api/books", () =>
				HttpResponse.json(makeBookList([makeBook({ id: BOOK_ID, title: "Clean Code" })])),
			),
			http.get("*/api/auth/me", () => HttpResponse.json(member)),
		)

		renderRoute("/loans")
		fireEvent.click(await screen.findByRole("button", { name: "Return" }))

		expect(await screen.findByText("Returned")).toBeInTheDocument()
	})

	it("hides Approve for members and shows 'awaiting approval'", async () => {
		mockLoans([makeLoan({ id: LOAN_ID, book_id: BOOK_ID, status: "returned" })], member)

		renderRoute("/loans")
		await screen.findByRole("article")

		expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument()
		expect(screen.getByText(/awaiting approval/i)).toBeInTheDocument()
	})

	it("shows Approve for staff on a returned loan", async () => {
		mockLoans([makeLoan({ id: LOAN_ID, book_id: BOOK_ID, status: "returned" })], staff)

		renderRoute("/loans")

		expect(await screen.findByRole("heading", { level: 1, name: "All loans" })).toBeInTheDocument()
		expect(await screen.findByRole("button", { name: "Approve" })).toBeInTheDocument()
	})
})
