import { createFileRoute } from "@tanstack/react-router"
import { BookDetailScreen } from "./_components/book-detail-screen.tsx"

export const Route = createFileRoute("/books/$id")({
	component: BookDetailRoute,
})

function BookDetailRoute() {
	const { id } = Route.useParams()
	return <BookDetailScreen id={id} />
}
