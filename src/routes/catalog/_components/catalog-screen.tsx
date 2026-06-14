import { match } from "ts-pattern"
import { AppBar } from "#/components/layout/app-bar.tsx"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { useListBooks } from "#/routes/catalog/_hooks/use-list-books.ts"
import { BookGrid } from "./book-grid.tsx"
import { CatalogEmpty, CatalogError, CatalogLoading } from "./catalog-states.tsx"
import { CatalogToolbar } from "./catalog-toolbar.tsx"
import { FinderControls, type TFinder } from "./finder-controls.tsx"

interface ICatalogScreenProps {
	// Finder filter (shelf/row), driven by the route's URL search params.
	finder?: TFinder
	onFinderChange?: (next: TFinder) => void
}

// The catalog list screen. Composes the chrome + finder and renders exactly one
// of the four states (loading / error / empty / loaded) off the query.
export function CatalogScreen({ finder = {}, onFinderChange }: ICatalogScreenProps) {
	const query = useListBooks(finder)

	return (
		<div className="app">
			<AppBar />
			<CatalogToolbar total={query.data?.pagination.total} />
			<FinderControls value={finder} onChange={(next) => onFinderChange?.(next)} />
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
