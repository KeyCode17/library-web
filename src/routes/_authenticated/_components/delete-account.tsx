import { useNavigate } from "@tanstack/react-router"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { useDeleteMe } from "#/routes/_authenticated/_hooks/use-delete-me.ts"

// Account deletion with a two-step confirm (a `<details>` disclosure — no blocking
// browser dialog). The server returns 409 if deleting would lock out the last admin.
export function DeleteAccount() {
	const remove = useDeleteMe()
	const navigate = useNavigate()

	return (
		<section className="account-card account-danger">
			<h2 className="account-card-title">Delete account</h2>
			<p className="state-body">This permanently removes your account and cannot be undone.</p>
			{remove.isError && (
				<p className="form-error" role="alert">
					{extractErrorMessage(remove.error)}
				</p>
			)}
			<details className="confirm">
				<summary className="btn danger">Delete my account</summary>
				<div className="confirm-body">
					<p className="state-body">Are you sure? This is irreversible.</p>
					<button
						type="button"
						className="btn danger"
						disabled={remove.isPending}
						onClick={async () => {
							try {
								await remove.mutateAsync()
								await navigate({ to: "/catalog" })
							} catch {
								// surfaced via remove.error
							}
						}}
					>
						{remove.isPending ? "Deleting…" : "Yes, delete my account"}
					</button>
				</div>
			</details>
		</section>
	)
}
