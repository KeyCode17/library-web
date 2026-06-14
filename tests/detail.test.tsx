import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import { delay, HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { makeBook } from "./mocks/books.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

const BOOK_URL = "*/api/books/:id"
const ID = "00000000-0000-4000-8000-000000000001"

describe("book detail (/books/$id)", () => {
	it("renders the book on success", async () => {
		const book = makeBook({
			id: ID,
			title: "The Rust Programming Language",
			author: "Steve Klabnik",
			isbn: "978-1718503106",
			shelf: "Tech",
			row: 4,
			available: true,
		})
		server.use(http.get(BOOK_URL, () => HttpResponse.json(book)))

		renderRoute(`/books/${ID}`)

		expect(
			await screen.findByRole("heading", { level: 1, name: "The Rust Programming Language" }),
		).toBeInTheDocument()
		expect(screen.getByText("Find it on the shelf")).toBeInTheDocument()
		expect(screen.getByText("Tech · Row 4")).toBeInTheDocument()
		expect(screen.getAllByText("978-1718503106").length).toBeGreaterThanOrEqual(1)
	})

	it("renders not-found on a 404", async () => {
		server.use(
			http.get(BOOK_URL, () =>
				HttpResponse.json({ code: "not_found", message: "book not found" }, { status: 404 }),
			),
		)

		renderRoute(`/books/${ID}`)

		expect(await screen.findByRole("heading", { name: /book not found/i })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: /back to catalogue/i })).toBeInTheDocument()
	})

	it("renders the error state on a 500", async () => {
		server.use(http.get(BOOK_URL, () => new HttpResponse(null, { status: 500 })))

		renderRoute(`/books/${ID}`)

		const alert = await screen.findByRole("alert")
		expect(alert).toHaveTextContent(/couldn’t load this book/i)
	})

	it("renders the loading state before data resolves", async () => {
		const book = makeBook({ id: ID, title: "Slow Detail" })
		server.use(
			http.get(BOOK_URL, async () => {
				await delay(150)
				return HttpResponse.json(book)
			}),
		)

		renderRoute(`/books/${ID}`)

		const loading = await screen.findByRole("status", { name: /loading book/i })
		await waitForElementToBeRemoved(loading)
		expect(
			await screen.findByRole("heading", { level: 1, name: "Slow Detail" }),
		).toBeInTheDocument()
	})
})
