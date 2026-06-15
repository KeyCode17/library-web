import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import { useUpdateMe } from "#/routes/_authenticated/_hooks/use-update-me.ts"

const schema = z.object({ email: z.email("Enter a valid email address") })

interface IUpdateEmailFormProps {
	currentEmail: string
}

export function UpdateEmailForm({ currentEmail }: IUpdateEmailFormProps) {
	const update = useUpdateMe()
	const form = useForm({
		defaultValues: { email: currentEmail },
		validators: { onChange: schema },
		onSubmit: async ({ value }) => {
			try {
				await update.mutateAsync(value)
			} catch {
				// surfaced via update.error
			}
		},
	})

	return (
		<section className="account-card">
			<h2 className="account-card-title">Update email</h2>
			<form
				className="account-form"
				onSubmit={(event) => {
					event.preventDefault()
					event.stopPropagation()
					form.handleSubmit()
				}}
			>
				<form.Field name="email">
					{(field) => (
						<div className="form-field">
							<label htmlFor={field.name}>Email</label>
							<input
								id={field.name}
								name={field.name}
								type="email"
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
				{update.isError && (
					<p className="form-error" role="alert">
						{extractErrorMessage(update.error)}
					</p>
				)}
				{update.isSuccess && (
					<p className="form-ok" role="status">
						Email updated.
					</p>
				)}
				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button type="submit" className="btn primary" disabled={!canSubmit || isSubmitting}>
							{isSubmitting ? "Saving…" : "Save email"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</section>
	)
}
