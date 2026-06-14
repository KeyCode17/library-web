import type { TBook } from "#/routes/catalog/_apis/index.ts"
import { BookCard } from "./book-card.tsx"

interface IBookGridProps {
	books: TBook[]
}

// The loaded state: the responsive card grid (design `.grid`).
export function BookGrid({ books }: IBookGridProps) {
	return (
		<main className="grid">
			{books.map((book) => (
				<BookCard key={book.id} book={book} />
			))}
		</main>
	)
}
