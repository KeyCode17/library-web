import { Link } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { tokenStore } from "#/libs/auth/token-store.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import type { TBook } from "#/routes/books/_apis/index.ts"
import { useBorrowBook } from "#/routes/books/_hooks/use-borrow-book.ts"

interface IBorrowButtonProps {
	book: TBook
}

// Borrow affordance for the detail page. Requires a session (anonymous → a login
// prompt); disabled when the book is already on loan. Surfaces 401/409 inline.
export function BorrowButton({ book }: IBorrowButtonProps) {
	const token = useStore(tokenStore, (state) => state.token)
	const borrow = useBorrowBook()

	if (token === null) {
		return (
			<Link to="/auth/login" className="btn primary">
				Log in to borrow
			</Link>
		)
	}

	if (!book.available) {
		return (
			<button type="button" className="btn primary" disabled>
				On loan
			</button>
		)
	}

	return (
		<>
			<button
				type="button"
				className="btn primary"
				disabled={borrow.isPending}
				onClick={() => borrow.mutate(book.id)}
			>
				{borrow.isPending ? "Borrowing…" : "Borrow"}
			</button>
			{borrow.isError && (
				<span className="borrow-error" role="alert">
					{extractErrorMessage(borrow.error)}
				</span>
			)}
		</>
	)
}
