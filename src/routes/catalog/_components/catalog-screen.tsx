import { match } from "ts-pattern"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { useListBooks } from "#/routes/catalog/_hooks/use-list-books.ts"
import { AppBar } from "./app-bar.tsx"
import { BookGrid } from "./book-grid.tsx"
import { CatalogEmpty, CatalogError, CatalogLoading } from "./catalog-states.tsx"
import { CatalogToolbar } from "./catalog-toolbar.tsx"

// The catalog list screen. Composes the chrome and renders exactly one of the
// four states (loading / error / empty / loaded) off the query, exhaustively.
export function CatalogScreen() {
	const query = useListBooks()

	return (
		<div className="app">
			<AppBar />
			<CatalogToolbar total={query.data?.pagination.total} />
			{match(query)
				.with({ status: "pending" }, () => <CatalogLoading />)
				.with({ status: "error" }, ({ error, refetch }) => (
					<CatalogError message={extractErrorMessage(error)} onRetry={() => refetch()} />
				))
				.with({ status: "success" }, ({ data }) =>
					data.data.length === 0 ? <CatalogEmpty /> : <BookGrid books={data.data} />,
				)
				.exhaustive()}
		</div>
	)
}
