import type { TListBooksParams } from "#/routes/catalog/_apis/index.ts"

export type TFinder = Pick<TListBooksParams, "shelf" | "row">

interface IFinderControlsProps {
	value: TFinder
	onChange: (next: TFinder) => void
}

const hasFilter = (finder: TFinder) => finder.shelf !== undefined || finder.row !== undefined

// Book-finder: narrow the catalogue to an exact shelf and/or row (contract finder
// params). Minimal by design — `docs/designs/catalog.html` has no finder UI, so
// this is a clean placeholder pending a design pass (see README).
export function FinderControls({ value, onChange }: IFinderControlsProps) {
	return (
		<search className="finder" aria-label="Find a book by shelf location">
			<label className="finder-field">
				<span className="finder-label">Shelf</span>
				<input
					type="text"
					className="finder-input"
					placeholder="e.g. Tech"
					value={value.shelf ?? ""}
					onChange={(event) => onChange({ ...value, shelf: event.target.value || undefined })}
				/>
			</label>
			<label className="finder-field">
				<span className="finder-label">Row</span>
				<input
					type="number"
					min={1}
					className="finder-input finder-input--row"
					placeholder="e.g. 3"
					value={value.row ?? ""}
					onChange={(event) => {
						const next = event.target.value === "" ? undefined : Number(event.target.value)
						onChange({ ...value, row: Number.isNaN(next as number) ? undefined : next })
					}}
				/>
			</label>
			{hasFilter(value) && (
				<button type="button" className="btn finder-clear" onClick={() => onChange({})}>
					Clear
				</button>
			)}
		</search>
	)
}
