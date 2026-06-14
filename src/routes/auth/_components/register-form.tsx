import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "@tanstack/react-router"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import { useRegister } from "#/routes/auth/_hooks/use-register.ts"
import { AuthCard } from "./auth-card.tsx"
import { credentialsSchema } from "./auth-schema.ts"

export function RegisterForm() {
	const navigate = useNavigate()
	const registerMutation = useRegister()

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onChange: credentialsSchema },
		onSubmit: async ({ value }) => {
			try {
				await registerMutation.mutateAsync(value)
				await navigate({ to: "/account" })
			} catch {
				// surfaced via registerMutation.error below
			}
		},
	})

	return (
		<AuthCard
			title="Create account"
			subtitle="Register as a member to borrow books."
			footer={
				<>
					Already have an account? <Link to="/auth/login">Sign in</Link>
				</>
			}
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

				<form.Field name="password">
					{(field) => (
						<div className="form-field">
							<label htmlFor={field.name}>Password</label>
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

				{registerMutation.isError && (
					<p className="form-error" role="alert">
						{extractErrorMessage(registerMutation.error)}
					</p>
				)}

				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							className="btn primary auth-submit"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Creating…" : "Create account"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</AuthCard>
	)
}
