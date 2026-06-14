import { useQuery } from "@tanstack/react-query"
import { AppBar } from "#/components/layout/app-bar.tsx"
import { bookKeys, listBooks } from "#/libs/api/books.ts"
import { useRecommend } from "#/routes/recommend/_hooks/use-recommend.ts"
import { RecommendForm } from "./recommend-form.tsx"
import { RecommendResults } from "./recommend-results.tsx"

// Public recommendations screen. The user expresses preferences; we call
// `/recommend` and resolve the ranked ids against the catalogue to show books in
// rank order. The recommender logic runs server-side (skill: never locally).
export function RecommendScreen() {
	const recommendMutation = useRecommend()
	const booksQuery = useQuery({
		queryKey: bookKeys.list({ page_size: 100 }),
		queryFn: () => listBooks({ page_size: 100 }),
	})

	const books = booksQuery.data?.data ?? []
	const bookById = new Map(books.map((book) => [book.id, book]))
	const shelves = Array.from(new Set(books.map((book) => book.shelf))).sort()

	return (
		<div className="app">
			<AppBar />
			<section className="head">
				<h1>Recommendations</h1>
				<p>Books ranked for what you like.</p>
			</section>
			<RecommendForm
				shelves={shelves}
				pending={recommendMutation.isPending}
				onSubmit={(preferences) => recommendMutation.mutate({ preferences })}
			/>
			<RecommendResults
				status={recommendMutation.status}
				rankedIds={recommendMutation.data?.ranked}
				error={recommendMutation.error}
				bookById={bookById}
			/>
		</div>
	)
}
