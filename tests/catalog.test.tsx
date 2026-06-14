import { fireEvent, screen, waitForElementToBeRemoved, within } from "@testing-library/react"
import { delay, HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { makeBook, makeBookList } from "./mocks/books.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

const BOOKS_URL = "*/api/books"

describe("catalog list (/catalog)", () => {
	it("renders a card per book on success", async () => {
		const books = [
			makeBook({ title: "Clean Code", author: "Robert C. Martin", shelf: "Tech", available: true }),
			makeBook({ title: "Dune", author: "Frank Herbert", shelf: "SciFi", available: false }),
			makeBook({ title: "1984", author: "George Orwell", shelf: "SciFi", available: true }),
		]
		server.use(http.get(BOOKS_URL, () => HttpResponse.json(makeBookList(books))))

		renderRoute("/catalog")

		expect(await screen.findByRole("heading", { name: "Clean Code" })).toBeInTheDocument()
		expect(screen.getAllByRole("article")).toHaveLength(3)

		// availability is bound per book — scope to the card to avoid the appbar
		// nav and filter chips that reuse the same words
		const duneCard = screen.getByRole("heading", { name: "Dune" }).closest("article")
		expect(duneCard).not.toBeNull()
		expect(within(duneCard as HTMLElement).getByText("Borrowed")).toBeInTheDocument()

		expect(screen.getByText("3 books")).toBeInTheDocument()
	})

	it("renders the empty state when there are no books", async () => {
		server.use(http.get(BOOKS_URL, () => HttpResponse.json(makeBookList([]))))

		renderRoute("/catalog")

		expect(await screen.findByText(/no books on the shelf/i)).toBeInTheDocument()
		expect(screen.queryAllByRole("article")).toHaveLength(0)
	})

	it("renders the error state when the request fails", async () => {
		server.use(http.get(BOOKS_URL, () => new HttpResponse(null, { status: 500 })))

		renderRoute("/catalog")

		const alert = await screen.findByRole("alert")
		expect(alert).toHaveTextContent(/couldn’t load the catalogue/i)
		expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
	})

	it("renders the loading state before data resolves", async () => {
		server.use(
			http.get(BOOKS_URL, async () => {
				await delay(150)
				return HttpResponse.json(makeBookList([makeBook({ title: "Slow Book" })]))
			}),
		)

		renderRoute("/catalog")

		const loading = await screen.findByRole("status", { name: /loading books/i })
		await waitForElementToBeRemoved(loading)
		expect(await screen.findByRole("heading", { name: "Slow Book" })).toBeInTheDocument()
	})

	it("filters the list by shelf via the finder", async () => {
		const all = [
			makeBook({ title: "Clean Code", shelf: "Tech" }),
			makeBook({ title: "Dune", shelf: "SciFi" }),
			makeBook({ title: "1984", shelf: "SciFi" }),
		]
		server.use(
			http.get(BOOKS_URL, ({ request }) => {
				const url = new URL(request.url)
				const shelf = url.searchParams.get("shelf")
				const filtered = shelf ? all.filter((book) => book.shelf === shelf) : all
				return HttpResponse.json(makeBookList(filtered))
			}),
		)

		renderRoute("/catalog")
		expect(await screen.findByRole("heading", { name: "Clean Code" })).toBeInTheDocument()
		expect(screen.getAllByRole("article")).toHaveLength(3)

		fireEvent.change(screen.getByRole("textbox", { name: "Shelf" }), {
			target: { value: "SciFi" },
		})

		// the filtered result loads (total drops to 2); the off-shelf book is gone
		expect(await screen.findByText("2 books")).toBeInTheDocument()
		expect(screen.getByRole("heading", { name: "Dune" })).toBeInTheDocument()
		expect(screen.getByRole("heading", { name: "1984" })).toBeInTheDocument()
		expect(screen.queryByRole("heading", { name: "Clean Code" })).not.toBeInTheDocument()
	})

	it("filters the list by isbn via the finder", async () => {
		const all = [
			makeBook({ title: "Clean Code", isbn: "978-0132350884" }),
			makeBook({ title: "Dune", isbn: "978-0441013593" }),
		]
		server.use(
			http.get(BOOKS_URL, ({ request }) => {
				const isbn = new URL(request.url).searchParams.get("isbn")
				const filtered = isbn ? all.filter((book) => book.isbn === isbn) : all
				return HttpResponse.json(makeBookList(filtered))
			}),
		)

		renderRoute("/catalog")
		expect(await screen.findByRole("heading", { name: "Clean Code" })).toBeInTheDocument()
		expect(screen.getAllByRole("article")).toHaveLength(2)

		fireEvent.change(screen.getByRole("textbox", { name: "ISBN" }), {
			target: { value: "978-0441013593" },
		})

		expect(await screen.findByText("1 book")).toBeInTheDocument()
		expect(screen.getByRole("heading", { name: "Dune" })).toBeInTheDocument()
		expect(screen.queryByRole("heading", { name: "Clean Code" })).not.toBeInTheDocument()
	})
})
