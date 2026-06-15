import { ALL_ROLES } from "#/libs/auth/roles.ts"
import { cn } from "#/libs/clsx/index.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import type { TRole, TUserSummary } from "#/routes/_authenticated/admin/_apis/index.ts"
import { useAssignRole } from "#/routes/_authenticated/admin/_hooks/use-assign-role.ts"
import { useDeleteUser } from "#/routes/_authenticated/admin/_hooks/use-delete-user.ts"
import { useUpdateUser } from "#/routes/_authenticated/admin/_hooks/use-update-user.ts"

interface IUserRowProps {
	user: TUserSummary
}

// One admin table row. State for the editable email comes from the uncontrolled
// form (read via FormData on submit) — no React state/refs (no-react-hooks rule).
export function UserRow({ user }: IUserRowProps) {
	const assign = useAssignRole()
	const update = useUpdateUser()
	const remove = useDeleteUser()
	const error = assign.error ?? update.error ?? remove.error

	return (
		<tr>
			<td>
				<form
					className="user-email-form"
					onSubmit={(event) => {
						event.preventDefault()
						const email = new FormData(event.currentTarget).get("email")
						if (typeof email === "string" && email !== user.email) {
							update.mutate({ id: user.id, body: { email } })
						}
					}}
				>
					{/* keyed by email so the default value refreshes after a save */}
					<input
						key={user.email}
						name="email"
						type="email"
						className="user-email-input"
						aria-label={`Email for ${user.email}`}
						defaultValue={user.email}
					/>
					<button type="submit" className="btn user-save">
						Save
					</button>
				</form>
			</td>
			<td>
				<select
					className="user-role"
					aria-label={`Role for ${user.email}`}
					value={user.role}
					onChange={(event) => assign.mutate({ id: user.id, role: event.target.value as TRole })}
				>
					{ALL_ROLES.map((role) => (
						<option key={role} value={role}>
							{role}
						</option>
					))}
				</select>
			</td>
			<td>
				<span className={cn("user-flag", user.verified ? "is-yes" : "is-no")}>
					{user.verified ? "Verified" : "Unverified"}
				</span>
			</td>
			<td>
				<span className={cn("user-flag", user.active ? "is-yes" : "is-no")}>
					{user.active ? "Active" : "Inactive"}
				</span>
			</td>
			<td className="user-actions">
				<button
					type="button"
					className="btn"
					onClick={() => update.mutate({ id: user.id, body: { active: !user.active } })}
				>
					{user.active ? "Deactivate" : "Reactivate"}
				</button>
				<details className="confirm">
					<summary className="btn danger">Delete</summary>
					<div className="confirm-body">
						<button
							type="button"
							className="btn danger"
							disabled={remove.isPending}
							onClick={() => remove.mutate(user.id)}
						>
							Confirm delete
						</button>
					</div>
				</details>
				{error && (
					<span className="row-error" role="alert">
						{extractErrorMessage(error)}
					</span>
				)}
			</td>
		</tr>
	)
}
