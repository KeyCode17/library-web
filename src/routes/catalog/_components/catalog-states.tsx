const SKELETON_COUNT = 8

// Loading: a grid of placeholder cards mirroring the loaded layout so the page
// does not shift when data arrives.
export function CatalogLoading() {
	return (
		<main className="grid" role="status" aria-label="Loading books">
			{Array.from({ length: SKELETON_COUNT }, (_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder list, no identity
				<div key={index} className="book-card book-card--skeleton" aria-hidden="true">
					<div className="cover skeleton-box" />
					<div className="bc-body">
						<div className="skeleton-line skeleton-line--title" />
						<div className="skeleton-line skeleton-line--author" />
						<div className="skeleton-line skeleton-line--meta" />
					</div>
				</div>
			))}
		</main>
	)
}

// Empty: the request succeeded but the catalogue has no books.
export function CatalogEmpty() {
	return (
		<div className="state-panel">
			<h2 className="state-title">No books on the shelf</h2>
			<p className="state-body">The catalogue is empty. Check back once books are added.</p>
		</div>
	)
}

interface ICatalogErrorProps {
	message: string
	onRetry: () => void
}

// Error: the request failed. Surfaces the normalised message and a retry.
export function CatalogError({ message, onRetry }: ICatalogErrorProps) {
	return (
		<div className="state-panel" role="alert">
			<h2 className="state-title">Couldn’t load the catalogue</h2>
			<p className="state-body">{message}</p>
			<button type="button" className="btn primary" onClick={onRetry}>
				Try again
			</button>
		</div>
	)
}
