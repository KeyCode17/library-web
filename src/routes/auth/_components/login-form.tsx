import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "@tanstack/react-router"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import { useLogin } from "#/routes/auth/_hooks/use-login.ts"
import { AuthCard } from "./auth-card.tsx"
import { credentialsSchema } from "./auth-schema.ts"

export function LoginForm() {
	const navigate = useNavigate()
	const loginMutation = useLogin()

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onChange: credentialsSchema },
		onSubmit: async ({ value }) => {
			try {
				await loginMutation.mutateAsync(value)
				await navigate({ to: "/account" })
			} catch {
				// surfaced via loginMutation.error below
			}
		},
	})

	return (
		<AuthCard
			title="Sign in"
			subtitle="Access your library account."
			footer={
				<>
					No account? <Link to="/auth/register">Create one</Link>
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
								autoComplete="current-password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
							/>
							<FieldError field={field} />
						</div>
					)}
				</form.Field>

				{loginMutation.isError && (
					<p className="form-error" role="alert">
						{extractErrorMessage(loginMutation.error)}
					</p>
				)}

				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							className="btn primary auth-submit"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Signing in…" : "Sign in"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</AuthCard>
	)
}
