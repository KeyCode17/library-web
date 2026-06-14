interface IShelfTabProps {
	shelf: string
	row: number
}

// The signature shelf-location tab (design `.shelf-tab`): a brass map-pin badge
// reading "<shelf> · <row>".
export function ShelfTab({ shelf, row }: IShelfTabProps) {
	return (
		<span className="shelf-tab">
			<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
			</svg>
			<span className="sl">{shelf}</span>·{row}
		</span>
	)
}
