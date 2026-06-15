import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import { useResetPassword } from "#/routes/auth/_hooks/use-reset-password.ts"
import { AuthCard } from "./auth-card.tsx"
import { passwordSchema } from "./auth-schema.ts"

interface IResetPasswordFormProps {
	token: string
}

export function ResetPasswordForm({ token }: IResetPasswordFormProps) {
	const reset = useResetPassword()
	const form = useForm({
		defaultValues: { password: "" },
		validators: { onChange: passwordSchema },
		onSubmit: async ({ value }) => {
			try {
				await reset.mutateAsync({ token, new_password: value.password })
			} catch {
				// surfaced via reset.error below
			}
		},
	})

	if (!token) {
		return (
			<AuthCard
				title="Invalid link"
				footer={<Link to="/auth/forgot-password">Request a new link</Link>}
			>
				<p className="form-error" role="alert">
					This reset link is missing its token.
				</p>
			</AuthCard>
		)
	}

	if (reset.isSuccess) {
		return (
			<AuthCard title="Password updated" footer={<Link to="/auth/login">Sign in</Link>}>
				<p className="auth-note">Your password has been reset. You can sign in now.</p>
			</AuthCard>
		)
	}

	return (
		<AuthCard
			title="Reset password"
			subtitle="Choose a new password."
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
				<form.Field name="password">
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
				{reset.isError && (
					<p className="form-error" role="alert">
						{extractErrorMessage(reset.error)}
					</p>
				)}
				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							className="btn primary auth-submit"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Resetting…" : "Reset password"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</AuthCard>
	)
}
