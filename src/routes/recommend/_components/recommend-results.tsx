import { match } from "ts-pattern"
import { BookCard } from "#/components/features/books/book-card.tsx"
import type { TBook } from "#/libs/api/books.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"

interface IRecommendResultsProps {
	status: "idle" | "pending" | "error" | "success"
	rankedIds: string[] | undefined
	error: unknown
	bookById: Map<string, TBook>
}

// Renders the recommendation states. On success the ranked ids are resolved to
// books (unknown ids dropped) and rendered in rank order.
export function RecommendResults({ status, rankedIds, error, bookById }: IRecommendResultsProps) {
	return match(status)
		.with("idle", () => (
			<div className="state-panel">
				<h2 className="state-title">Tell us what you like</h2>
				<p className="state-body">Pick shelves or authors, then get a ranked list.</p>
			</div>
		))
		.with("pending", () => (
			<p className="state-body" role="status" aria-label="Ranking recommendations">
				Ranking recommendations…
			</p>
		))
		.with("error", () => (
			<div className="state-panel" role="alert">
				<h2 className="state-title">Couldn’t get recommendations</h2>
				<p className="state-body">{extractErrorMessage(error)}</p>
			</div>
		))
		.with("success", () => {
			const books = (rankedIds ?? [])
				.map((id) => bookById.get(id))
				.filter((book): book is TBook => book !== undefined)

			if (books.length === 0) {
				return (
					<div className="state-panel">
						<h2 className="state-title">No recommendations</h2>
						<p className="state-body">Try different preferences.</p>
					</div>
				)
			}

			return (
				<ol className="rec-results">
					{books.map((book, index) => (
						<li key={book.id} className="rec-item">
							<span className="rec-rank">#{index + 1}</span>
							<BookCard book={book} />
						</li>
					))}
				</ol>
			)
		})
		.exhaustive()
}
