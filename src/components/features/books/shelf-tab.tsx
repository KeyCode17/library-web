import { MapPinIcon } from "./map-pin-icon.tsx"

interface IShelfTabProps {
	shelf: string
	row: number
}

// The signature shelf-location tab (design `.shelf-tab`): a brass map-pin badge
// reading "<shelf> · <row>".
export function ShelfTab({ shelf, row }: IShelfTabProps) {
	return (
		<span className="shelf-tab">
			<MapPinIcon />
			<span className="sl">{shelf}</span>·{row}
		</span>
	)
}
