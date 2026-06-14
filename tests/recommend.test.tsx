import { fireEvent, screen, within } from "@testing-library/react"
import { delay, HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { makeBook, makeBookList } from "./mocks/books.ts"
import { server } from "./mocks/server.ts"
import { renderRoute } from "./utils.tsx"

const RECOMMEND_URL = "*/api/recommend"
const BOOKS_URL = "*/api/books"

const cleanCode = makeBook({
	id: "00000000-0000-4000-8000-000000000001",
	title: "Clean Code",
	shelf: "Tech",
})
const dune = makeBook({ id: "00000000-0000-4000-8000-000000000004", title: "Dune", shelf: "SciFi" })
const nineteen = makeBook({
	id: "00000000-0000-4000-8000-000000000005",
	title: "1984",
	shelf: "SciFi",
})

function mockBooks() {
	return http.get(BOOKS_URL, () => HttpResponse.json(makeBookList([cleanCode, dune, nineteen])))
}

async function submit() {
	fireEvent.click(await screen.findByRole("button", { name: /get recommendations/i }))
}

describe("recommendations (/recommend)", () => {
	it("renders ranked results in order after submitting preferences", async () => {
		server.use(
			mockBooks(),
			http.post(RECOMMEND_URL, () =>
				HttpResponse.json({ ranked: [nineteen.id, cleanCode.id, dune.id] }),
			),
		)

		renderRoute("/recommend")
		// idle prompt before submitting
		expect(await screen.findByText(/tell us what you like/i)).toBeInTheDocument()

		await submit()

		const articles = await screen.findAllByRole("article")
		const titles = articles.map((article) => within(article).getByRole("heading").textContent)
		expect(titles).toEqual(["1984", "Clean Code", "Dune"])
	})

	it("renders the loading state while ranking", async () => {
		server.use(
			mockBooks(),
			http.post(RECOMMEND_URL, async () => {
				await delay(150)
				return HttpResponse.json({ ranked: [cleanCode.id] })
			}),
		)

		renderRoute("/recommend")
		await submit()

		expect(
			await screen.findByRole("status", { name: /ranking recommendations/i }),
		).toBeInTheDocument()
	})

	it("renders the empty state when nothing is ranked", async () => {
		server.use(
			mockBooks(),
			http.post(RECOMMEND_URL, () => HttpResponse.json({ ranked: [] })),
		)

		renderRoute("/recommend")
		await submit()

		expect(await screen.findByText(/no recommendations/i)).toBeInTheDocument()
	})

	it("renders the error state when /recommend fails", async () => {
		server.use(
			mockBooks(),
			http.post(RECOMMEND_URL, () => new HttpResponse(null, { status: 500 })),
		)

		renderRoute("/recommend")
		await submit()

		expect(await screen.findByRole("alert")).toHaveTextContent(/couldn’t get recommendations/i)
	})
})
