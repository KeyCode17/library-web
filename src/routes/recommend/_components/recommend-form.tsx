import { useForm } from "@tanstack/react-form"
import { cn } from "#/libs/clsx/index.ts"
import type { TPreferences } from "#/routes/recommend/_apis/index.ts"

interface IRecommendFormProps {
	shelves: string[]
	pending: boolean
	onSubmit: (preferences: TPreferences) => void
}

// Preferences form (TanStack Form; no React hooks). Shelves toggle as chips,
// authors are comma-separated free text, and an availability switch maps to the
// contract `Preferences` shape.
export function RecommendForm({ shelves, pending, onSubmit }: IRecommendFormProps) {
	const form = useForm({
		defaultValues: { shelves: [] as string[], authors: "", availableOnly: false },
		onSubmit: ({ value }) => {
			onSubmit({
				preferred_shelves: value.shelves,
				preferred_authors: value.authors
					.split(",")
					.map((author) => author.trim())
					.filter(Boolean),
				available_only: value.availableOnly,
			})
		},
	})

	return (
		<form
			className="rec-form"
			onSubmit={(event) => {
				event.preventDefault()
				event.stopPropagation()
				form.handleSubmit()
			}}
		>
			<form.Field name="shelves">
				{(field) => (
					<fieldset className="rec-field">
						<legend className="rec-legend">Preferred shelves</legend>
						<div className="rec-chips">
							{shelves.length === 0 ? (
								<span className="rec-hint">No shelves yet</span>
							) : (
								shelves.map((shelf) => {
									const selected = field.state.value.includes(shelf)
									return (
										<button
											key={shelf}
											type="button"
											aria-pressed={selected}
											className={cn("chip", selected && "on")}
											onClick={() =>
												field.handleChange(
													selected
														? field.state.value.filter((value) => value !== shelf)
														: [...field.state.value, shelf],
												)
											}
										>
											{shelf}
										</button>
									)
								})
							)}
						</div>
					</fieldset>
				)}
			</form.Field>

			<form.Field name="authors">
				{(field) => (
					<div className="form-field">
						<label htmlFor={field.name}>Preferred authors</label>
						<input
							id={field.name}
							name={field.name}
							type="text"
							placeholder="comma-separated, e.g. Robert C. Martin"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
						/>
					</div>
				)}
			</form.Field>

			<form.Field name="availableOnly">
				{(field) => (
					<label className="rec-check">
						<input
							type="checkbox"
							checked={field.state.value}
							onChange={(event) => field.handleChange(event.target.checked)}
						/>
						Available now only
					</label>
				)}
			</form.Field>

			<button type="submit" className="btn primary" disabled={pending}>
				{pending ? "Ranking…" : "Get recommendations"}
			</button>
		</form>
	)
}
