import { cn } from "#/libs/clsx/index.ts"

// Quick text-search chips. "All" clears the query; the others set `q` to their
// label (mapped to GET /books?q=). Labels are the design's clean default — the
// design pass is a separate task.
const FILTER_CHIPS = ["All", "Available", "Fiction", "Science", "Reference"] as const

interface ICatalogToolbarProps {
	// Total across all pages, shown as the count. Undefined while not yet loaded.
	total?: number
	// The active text query (drives chip selection).
	q?: string
	onSelectChip: (q: string | undefined) => void
}

// Page heading + filter row (design `.head` + `.filters`).
export function CatalogToolbar({ total, q, onSelectChip }: ICatalogToolbarProps) {
	return (
		<>
			<section className="head">
				<h1>Catalog</h1>
				<p>Browse the collection and find any book on the shelf.</p>
			</section>
			<div className="filters">
				{FILTER_CHIPS.map((label) => {
					const isAll = label === "All"
					const active = isAll ? q === undefined : q === label
					return (
						<button
							key={label}
							type="button"
							aria-pressed={active}
							className={cn("chip", active && "on")}
							onClick={() => onSelectChip(isAll ? undefined : label)}
						>
							{label}
						</button>
					)
				})}
				<span className="sp" />
				{total !== undefined && (
					<span className="count">
						{total} {total === 1 ? "book" : "books"}
					</span>
				)}
			</div>
		</>
	)
}
