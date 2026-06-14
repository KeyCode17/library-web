import type { TBook, TBookList } from "#/routes/catalog/_apis/index.ts"

let seq = 0

// Contract-shaped Book factory (components.schemas.Book).
export function makeBook(overrides: Partial<TBook> = {}): TBook {
	seq += 1
	return {
		id: `00000000-0000-4000-8000-${String(seq).padStart(12, "0")}`,
		title: `Book ${seq}`,
		author: `Author ${seq}`,
		isbn: `978-000000000${seq}`,
		shelf: "Tech",
		row: seq,
		available: true,
		...overrides,
	}
}

// Contract-shaped BookList envelope (components.schemas.BookList).
export function makeBookList(books: TBook[]): TBookList {
	return {
		data: books,
		pagination: {
			page: 1,
			page_size: 20,
			total: books.length,
			total_pages: books.length === 0 ? 0 : 1,
		},
	}
}
