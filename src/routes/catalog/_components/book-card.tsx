import { Link } from "@tanstack/react-router"
import { AvailabilityBadge } from "#/components/features/books/availability-badge.tsx"
import { BookCover } from "#/components/features/books/book-cover.tsx"
import { coverColor } from "#/components/features/books/cover-color.ts"
import { ShelfTab } from "#/components/features/books/shelf-tab.tsx"
import type { TBook } from "#/routes/catalog/_apis/index.ts"

interface IBookCardProps {
	book: TBook
}

// A single catalog card (design `.book-card`): cover, title, author, an
// availability/call-number meta row, and the shelf-location tab. The whole card
// links to the book's detail route. The contract has no call number, so the ISBN
// fills the mono `.call` slot.
export function BookCard({ book }: IBookCardProps) {
	return (
		<article className="book-card">
			<Link to="/books/$id" params={{ id: book.id }} className="book-card-link">
				<BookCover title={book.title} author={book.author} color={coverColor(book.id)} />
				<div className="bc-body">
					<h3 className="bc-title">{book.title}</h3>
					<p className="bc-author">{book.author}</p>
					<div className="bc-meta">
						<AvailabilityBadge available={book.available} />
						<span className="call">{book.isbn}</span>
					</div>
					<div className="bc-shelf">
						<ShelfTab shelf={book.shelf} row={book.row} />
					</div>
				</div>
			</Link>
		</article>
	)
}
