import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { ALL_ROLES } from "#/libs/auth/roles.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { FieldError } from "#/libs/tanstack-form/field-error.tsx"
import type { TRole } from "#/routes/_authenticated/admin/_apis/index.ts"
import { useCreateUser } from "#/routes/_authenticated/admin/_hooks/use-create-user.ts"

const schema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(8, "At least 8 characters"),
	role: z.enum(["admin", "librarian", "member"]),
})

export function CreateUserForm() {
	const create = useCreateUser()
	const form = useForm({
		defaultValues: { email: "", password: "", role: "member" as TRole },
		validators: { onChange: schema },
		onSubmit: async ({ value }) => {
			try {
				await create.mutateAsync(value)
				form.reset()
			} catch {
				// surfaced via create.error
			}
		},
	})

	return (
		<section className="account-card">
			<h2 className="account-card-title">Create user</h2>
			<form
				className="create-user-form"
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
				<form.Field name="role">
					{(field) => (
						<div className="form-field">
							<label htmlFor={field.name}>Role</label>
							<select
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(event) => field.handleChange(event.target.value as TRole)}
							>
								{ALL_ROLES.map((role) => (
									<option key={role} value={role}>
										{role}
									</option>
								))}
							</select>
						</div>
					)}
				</form.Field>
				{create.isError && (
					<p className="form-error" role="alert">
						{extractErrorMessage(create.error)}
					</p>
				)}
				{create.isSuccess && (
					<p className="form-ok" role="status">
						User created.
					</p>
				)}
				<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
					{([canSubmit, isSubmitting]) => (
						<button type="submit" className="btn primary" disabled={!canSubmit || isSubmitting}>
							{isSubmitting ? "Creating…" : "Create user"}
						</button>
					)}
				</form.Subscribe>
			</form>
		</section>
	)
}
