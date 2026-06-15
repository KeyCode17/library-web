import { Link, useNavigate } from "@tanstack/react-router"
import { useLogout } from "#/libs/auth/use-logout.ts"
import { useSession } from "#/libs/auth/use-session.ts"

// Auth-aware corner of the app bar. Sign-in state comes from the session cookie
// via `GET /auth/me` (no JS token): a principal → signed in; otherwise anonymous.
export function AuthMenu() {
	const session = useSession()
	const logout = useLogout()
	const navigate = useNavigate()

	// While the first /auth/me is in flight, render an empty slot to avoid a flash
	// of the anonymous links for an already-signed-in user.
	if (session.isPending) {
		return <div className="auth-menu" />
	}

	const principal = session.data
	if (!principal) {
		return (
			<div className="auth-menu">
				<Link to="/auth/login" className="auth-link">
					Log in
				</Link>
				<Link to="/auth/register" className="btn auth-register">
					Register
				</Link>
			</div>
		)
	}

	const initials = principal.email.slice(0, 2).toUpperCase()

	return (
		<div className="auth-menu">
			{principal.role === "admin" && (
				<Link to="/admin/users" className="auth-link">
					Manage users
				</Link>
			)}
			<Link to="/chat" className="auth-link">
				Chat
			</Link>
			<Link to="/loans" className="auth-link">
				My loans
			</Link>
			<div className="auth-id">
				<span className="auth-email">{principal.email}</span>
				<span className="auth-role">{principal.role}</span>
			</div>
			<div className="avatar" title={principal.email}>
				{initials}
			</div>
			<button
				type="button"
				className="auth-link"
				onClick={() => {
					logout.mutate(undefined, {
						onSuccess: () => navigate({ to: "/catalog" }),
					})
				}}
			>
				Log out
			</button>
		</div>
	)
}
