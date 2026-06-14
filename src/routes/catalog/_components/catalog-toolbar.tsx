const FILTER_CHIPS = ["All", "Available", "Fiction", "Science", "Reference"] as const

interface ICatalogToolbarProps {
	// Total across all pages, shown as the count. Undefined while not yet loaded.
	total?: number
}

// Page heading + filter row (design `.head` + `.filters`). The chips are
// presentational for T-001 (no filter params in the contract); only the count
// is data-bound.
export function CatalogToolbar({ total }: ICatalogToolbarProps) {
	return (
		<>
			<section className="head">
				<h1>Catalog</h1>
				<p>Browse the collection and find any book on the shelf.</p>
			</section>
			<div className="filters">
				{FILTER_CHIPS.map((label, index) => (
					<button key={label} type="button" className={index === 0 ? "chip on" : "chip"}>
						{label}
					</button>
				))}
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
