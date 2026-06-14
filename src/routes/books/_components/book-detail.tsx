import { Link } from "@tanstack/react-router"
import { AvailabilityBadge } from "#/components/features/books/availability-badge.tsx"
import { BookCover } from "#/components/features/books/book-cover.tsx"
import { coverColor } from "#/components/features/books/cover-color.ts"
import { MapPinIcon } from "#/components/features/books/map-pin-icon.tsx"
import { ShelfTab } from "#/components/features/books/shelf-tab.tsx"
import type { TBook } from "#/routes/books/_apis/index.ts"

interface IBookDetailProps {
	book: TBook
}

// The loaded book detail (design `docs/designs/catalog-detail.html`): cover + a
// body whose hero is the shelf-location block. Facts and actions are bound to the
// contract; fields the contract lacks (description, published, pages, copy counts)
// are intentionally omitted rather than fabricated.
export function BookDetail({ book }: IBookDetailProps) {
	return (
		<>
			<nav className="crumbs" aria-label="Breadcrumb">
				<Link to="/catalog">Catalog</Link> &nbsp;/&nbsp; {book.shelf} &nbsp;/&nbsp; {book.title}
			</nav>
			<section className="detail">
				<BookCover title={book.title} author={book.author} color={coverColor(book.id)} />
				<div className="dt-body">
					<div className="dt-head">
						<h1>{book.title}</h1>
						<div className="by">{book.author}</div>
					</div>
					<div className="dt-status">
						<AvailabilityBadge available={book.available} />
						<span className="call">{book.isbn}</span>
					</div>
					<div className="dt-shelf-big">
						<MapPinIcon />
						<div>
							<div className="lbl">Find it on the shelf</div>
							<div className="val">
								{book.shelf} · Row {book.row}
							</div>
						</div>
						<div className="shelf-loc">
							<ShelfTab shelf={book.shelf} row={book.row} />
						</div>
					</div>
					{/* Lending actions are presentational — no lending endpoints in the
					    contract yet (M2). See README. */}
					<div className="actions">
						<button type="button" className="btn primary">
							Borrow
						</button>
						<button type="button" className="btn">
							Reserve
						</button>
					</div>
					<dl className="facts">
						<div className="fact">
							<dt className="k">ISBN</dt>
							<dd className="v mono">{book.isbn}</dd>
						</div>
						<div className="fact">
							<dt className="k">Shelf</dt>
							<dd className="v">{book.shelf}</dd>
						</div>
						<div className="fact">
							<dt className="k">Row</dt>
							<dd className="v">{book.row}</dd>
						</div>
						<div className="fact">
							<dt className="k">Status</dt>
							<dd className="v">{book.available ? "Available" : "Borrowed"}</dd>
						</div>
					</dl>
				</div>
			</section>
		</>
	)
}
