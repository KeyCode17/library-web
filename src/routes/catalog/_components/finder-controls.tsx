import type { TListBooksParams } from "#/routes/catalog/_apis/index.ts"

export type TFinder = Pick<TListBooksParams, "shelf" | "row" | "isbn" | "q">

interface IFinderControlsProps {
	value: TFinder
	onChange: (next: TFinder) => void
}

const hasFilter = (finder: TFinder) =>
	finder.shelf !== undefined ||
	finder.row !== undefined ||
	finder.isbn !== undefined ||
	finder.q !== undefined

// Book-finder: narrow the catalogue to an exact shelf and/or row (contract finder
// params). Intentionally minimal — `docs/designs/catalog.html` ships no finder UI,
// so a spare control built on the catalog tokens is the intended design here.
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
			<label className="finder-field">
				<span className="finder-label">ISBN</span>
				<input
					type="text"
					className="finder-input"
					placeholder="e.g. 978-0132350884"
					value={value.isbn ?? ""}
					onChange={(event) => onChange({ ...value, isbn: event.target.value || undefined })}
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
