import { screen, waitForElementToBeRemoved, within } from "@testing-library/react"
import { delay, HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { CatalogScreen } from "#/routes/catalog/_components/catalog-screen.tsx"
import { makeBook, makeBookList } from "./mocks/books.ts"
import { server } from "./mocks/server.ts"
import { renderWithQuery } from "./utils.tsx"

const BOOKS_URL = "*/api/books"

describe("CatalogScreen", () => {
	it("renders a card per book on success", async () => {
		const books = [
			makeBook({ title: "Clean Code", author: "Robert C. Martin", available: true }),
			makeBook({ title: "Dune", author: "Frank Herbert", available: false }),
			makeBook({ title: "1984", author: "George Orwell", available: true }),
		]
		server.use(http.get(BOOKS_URL, () => HttpResponse.json(makeBookList(books))))

		renderWithQuery(<CatalogScreen />)

		expect(await screen.findByRole("heading", { name: "Clean Code" })).toBeInTheDocument()
		expect(screen.getAllByRole("article")).toHaveLength(3)

		// availability is bound per book — scope to the card to avoid the appbar
		// nav ("Borrowed") and filter chip ("Available") chrome of the same words
		const duneCard = screen.getByRole("heading", { name: "Dune" }).closest("article")
		expect(duneCard).not.toBeNull()
		expect(within(duneCard as HTMLElement).getByText("Borrowed")).toBeInTheDocument()

		// the count reflects the contract pagination total
		expect(screen.getByText("3 books")).toBeInTheDocument()
	})

	it("renders the empty state when there are no books", async () => {
		server.use(http.get(BOOKS_URL, () => HttpResponse.json(makeBookList([]))))

		renderWithQuery(<CatalogScreen />)

		expect(await screen.findByText(/no books on the shelf/i)).toBeInTheDocument()
		expect(screen.queryAllByRole("article")).toHaveLength(0)
	})

	it("renders the error state when the request fails", async () => {
		server.use(http.get(BOOKS_URL, () => new HttpResponse(null, { status: 500 })))

		renderWithQuery(<CatalogScreen />)

		const alert = await screen.findByRole("alert")
		expect(alert).toHaveTextContent(/couldn’t load the catalogue/i)
		expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
	})

	it("renders the loading state before data resolves", async () => {
		server.use(
			http.get(BOOKS_URL, async () => {
				await delay(20)
				return HttpResponse.json(makeBookList([makeBook({ title: "Slow Book" })]))
			}),
		)

		renderWithQuery(<CatalogScreen />)

		const loading = screen.getByRole("status", { name: /loading books/i })
		expect(loading).toBeInTheDocument()
		// flush the pending fetch so the loaded grid replaces the skeleton
		await waitForElementToBeRemoved(loading)
		expect(await screen.findByRole("heading", { name: "Slow Book" })).toBeInTheDocument()
	})
})
