import { Link } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { PageShell } from "#/components/layout/page-shell.tsx"
import { useSession } from "#/libs/auth/use-session.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { ChangePasswordForm } from "./change-password-form.tsx"
import { DeleteAccount } from "./delete-account.tsx"
import { UpdateEmailForm } from "./update-email-form.tsx"

// The authenticated-only account page. Reaching it proves the route guard; the
// content reads the live principal from `GET /auth/me` and offers self-service.
export function AccountScreen() {
	const session = useSession()

	return (
		<PageShell>
			<section className="head">
				<h1>Account</h1>
				<p>Your library identity.</p>
			</section>
			{match(session)
				.with({ status: "pending" }, () => (
					<p className="state-body" role="status">
						Loading your account…
					</p>
				))
				.with({ status: "error" }, ({ error }) => (
					<div className="state-panel" role="alert">
						<h2 className="state-title">Session problem</h2>
						<p className="state-body">{extractErrorMessage(error)}</p>
					</div>
				))
				.with({ status: "success" }, ({ data }) => (
					<div className="account">
						<dl className="facts account-facts">
							<div className="fact">
								<dt className="k">Email</dt>
								<dd className="v">{data.email}</dd>
							</div>
							<div className="fact">
								<dt className="k">Role</dt>
								<dd className="v">{data.role}</dd>
							</div>
							<div className="fact">
								<dt className="k">Email verified</dt>
								<dd className="v">{data.verified ? "Yes" : "No"}</dd>
							</div>
							<div className="fact">
								<dt className="k">User id</dt>
								<dd className="v mono">{data.id}</dd>
							</div>
						</dl>
						{data.role === "admin" && (
							<Link to="/admin/users" className="btn primary account-admin-link">
								Manage users
							</Link>
						)}
						<UpdateEmailForm currentEmail={data.email} />
						<ChangePasswordForm />
						<DeleteAccount />
					</div>
				))
				.exhaustive()}
		</PageShell>
	)
}
