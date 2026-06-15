import { useQuery } from "@tanstack/react-query"
import { meQueryOptions } from "#/libs/auth/session.ts"

// The current session, authenticated by the httpOnly `session` cookie. With cookie
// auth there is no JS token to gate on, so this always asks `GET /auth/me`:
// `data` → signed in; a 401 error → anonymous. TanStack Query; no React hooks.
export function useSession() {
	return useQuery(meQueryOptions)
}
