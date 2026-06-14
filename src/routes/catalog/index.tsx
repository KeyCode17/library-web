import { createFileRoute } from "@tanstack/react-router"
import { CatalogScreen } from "./_components/catalog-screen.tsx"
import type { TFinder } from "./_components/finder-controls.tsx"

// Finder state lives in the URL (shareable, bookmarkable) rather than component
// state — the idiomatic TanStack home for filters.
function validateSearch(search: Record<string, unknown>): TFinder {
	const finder: TFinder = {}
	if (typeof search.shelf === "string" && search.shelf !== "") {
		finder.shelf = search.shelf
	}
	const row = Number(search.row)
	if (search.row !== undefined && search.row !== "" && Number.isInteger(row)) {
		finder.row = row
	}
	return finder
}

export const Route = createFileRoute("/catalog/")({
	validateSearch,
	component: CatalogRoute,
})

function CatalogRoute() {
	const search = Route.useSearch()
	const navigate = Route.useNavigate()
	return <CatalogScreen finder={search} onFinderChange={(next) => navigate({ search: next })} />
}
