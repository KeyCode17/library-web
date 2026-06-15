import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import { useChangePassword } from "#/routes/_authenticated/_hooks/use-change-password.ts"

const schema = z.object({
	current_password: z.string().min(1, "Enter your current password"),
	new_password: z.string().min(8, "At least 8 characters"),
})

export function ChangePasswordForm() {
	const change = useChangePassword()
	const form = useForm({
		defaultValues: { current_password: "", new_password: "" },
		validators: { onChange: schema },
		onSubmit: async ({ value }) => {
			try {
				await change.mutateAsync(value)
				form.reset()
			} catch {
				// surfaced via change.error
			}
		},
	})

	return (
		<section className="account-card">
			<h2 className="account-card-title">Change password</h2>
			<form
				className="account-form"
				onSubmit={(event) => {
					event.preventDefault()
					event.stopPropagation()
					form.handleSubmit()
				}}
			>
				<form.Field name="current_password">
					{(field) => (
						<div className="form-field">
							<label htmlFor={field.name}>Current password</label>
							<input
								id={field.name}
								name={field.name}
								type="password"
								autoComplete="current-password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
				<form.Field name="new_password">
					{(field) => (
						<div className="form-field">
							<label htmlFor={field.name}>New password</label>
							<input
								id={field.name}
								name={field.name}
								type="password"
								autoComplete="new-password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>
				{change.isError && (
					<p className="form-error" role="alert">
						{extractErrorMessage(change.error)}
					</p>
				)}
				{change.isSuccess && (
					<p className="form-ok" role="status">
						Password changed.
					</p>
				)}
				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button type="submit" className="btn primary" disabled={!canSubmit || isSubmitting}>
							{isSubmitting ? "Updating…" : "Update password"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</section>
	)
}
