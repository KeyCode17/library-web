import { useSession } from "#/libs/auth/use-session.ts"

// Shown only to a signed-in user whose email is not yet verified. Anonymous users
// have no session, so it renders nothing for them.
export function UnverifiedBanner() {
	const session = useSession()
	if (session.data?.verified !== false) return null
	return (
		<div className="verify-banner" role="status">
			Your email isn't verified yet — check your inbox for the verification link.
		</div>
	)
}
