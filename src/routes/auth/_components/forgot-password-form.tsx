import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import { useForgotPassword } from "#/routes/auth/_hooks/use-forgot-password.ts"
import { AuthCard } from "./auth-card.tsx"
import { emailSchema } from "./auth-schema.ts"

export function ForgotPasswordForm() {
	const forgot = useForgotPassword()
	const form = useForm({
		defaultValues: { email: "" },
		validators: { onChange: emailSchema },
		onSubmit: async ({ value }) => {
			// Always neutral — never reveal whether the address exists.
			try {
				await forgot.mutateAsync(value)
			} catch {
				// swallowed; the confirmation is identical either way
			}
		},
	})

	if (forgot.isSuccess || forgot.isError) {
		return (
			<AuthCard title="Check your email" footer={<Link to="/auth/login">Back to sign in</Link>}>
				<p className="auth-note">
					If an account exists for that address, we've sent a password-reset link.
				</p>
			</AuthCard>
		)
	}

	return (
		<AuthCard
			title="Forgot password"
			subtitle="We'll email you a link to reset it."
			footer={<Link to="/auth/login">Back to sign in</Link>}
		>
			<form
				className="auth-form"
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
				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							className="btn primary auth-submit"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Sending…" : "Send reset link"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</AuthCard>
	)
}
