import { Link, useNavigate } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { tokenStore } from "#/libs/auth/token-store.ts"
import { useLogout } from "#/libs/auth/use-logout.ts"
import { useSession } from "#/libs/auth/use-session.ts"

// Auth-aware corner of the app bar: anonymous → login/register links;
// authenticated → email + role, avatar, and logout.
export function AuthMenu() {
	const token = useStore(tokenStore, (state) => state.token)
	const session = useSession()
	const logout = useLogout()
	const navigate = useNavigate()

	if (token === null) {
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

	const principal = session.data
	const initials = principal ? principal.email.slice(0, 2).toUpperCase() : "··"

	return (
		<div className="auth-menu">
			<Link to="/chat" className="auth-link">
				Chat
			</Link>
			<Link to="/loans" className="auth-link">
				My loans
			</Link>
			{principal && (
				<div className="auth-id">
					<span className="auth-email">{principal.email}</span>
					<span className="auth-role">{principal.role}</span>
				</div>
			)}
			<div className="avatar" title={principal?.email}>
				{initials}
			</div>
			<button
				type="button"
				className="auth-link"
				onClick={() => {
					logout()
					navigate({ to: "/catalog" })
				}}
			>
				Log out
			</button>
		</div>
	)
}
