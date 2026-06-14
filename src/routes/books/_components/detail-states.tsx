import { Link } from "@tanstack/react-router"

// Loading: a placeholder mirroring the detail grid (cover + body lines).
export function DetailLoading() {
	return (
		<section className="detail" role="status" aria-label="Loading book">
			<div className="cover skeleton-box" aria-hidden="true" />
			<div className="dt-body" aria-hidden="true">
				<div className="skeleton-line skeleton-line--h1" />
				<div className="skeleton-line skeleton-line--author" />
				<div className="skeleton-box skeleton-shelf" />
				<div className="skeleton-line skeleton-line--meta" />
			</div>
		</section>
	)
}

// Not found: the book id resolved to a 404.
export function DetailNotFound() {
	return (
		<div className="state-panel">
			<h1 className="state-title">Book not found</h1>
			<p className="state-body">No book matches this id. It may have been removed.</p>
			<Link to="/catalog" className="btn primary">
				Back to catalogue
			</Link>
		</div>
	)
}

interface IDetailErrorProps {
	message: string
	onRetry: () => void
}

// Error: a non-404 failure loading the book.
export function DetailError({ message, onRetry }: IDetailErrorProps) {
	return (
		<div className="state-panel" role="alert">
			<h1 className="state-title">Couldn’t load this book</h1>
			<p className="state-body">{message}</p>
			<div className="actions">
				<button type="button" className="btn primary" onClick={onRetry}>
					Try again
				</button>
				<Link to="/catalog" className="btn">
					Back to catalogue
				</Link>
			</div>
		</div>
	)
}
