import { match } from "ts-pattern"
import { PageShell } from "#/components/layout/page-shell.tsx"
import { extractErrorMessage, isApiError } from "#/libs/errors/index.ts"
import { useBook } from "#/routes/books/_hooks/use-book.ts"
import { BookDetail } from "./book-detail.tsx"
import { DetailError, DetailLoading, DetailNotFound } from "./detail-states.tsx"

interface IBookDetailScreenProps {
	id: string
}

// The book detail screen. Renders exactly one of the four states off the query:
// loading / not-found (404) / error / loaded.
export function BookDetailScreen({ id }: IBookDetailScreenProps) {
	const query = useBook(id)

	return (
		<PageShell showNav={false}>
			{match(query)
				.with({ status: "pending" }, () => <DetailLoading />)
				.with({ status: "error" }, ({ error, refetch }) =>
					isApiError(error) && error.status === 404 ? (
						<DetailNotFound />
					) : (
						<DetailError message={extractErrorMessage(error)} onRetry={() => refetch()} />
					),
				)
				.with({ status: "success" }, ({ data }) => <BookDetail book={data} />)
				.exhaustive()}
		</PageShell>
	)
}
