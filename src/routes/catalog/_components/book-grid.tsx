import { BookCard } from "#/components/features/books/book-card.tsx"
import type { TBook } from "#/routes/catalog/_apis/index.ts"

interface IBookGridProps {
	books: TBook[]
}

// The loaded state: the responsive card grid (design `.grid`).
export function BookGrid({ books }: IBookGridProps) {
	return (
		<div className="grid">
			{books.map((book) => (
				<BookCard key={book.id} book={book} />
			))}
		</div>
	)
}
