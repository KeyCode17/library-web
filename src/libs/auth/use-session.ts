import { useQuery } from "@tanstack/react-query"
import { useStore } from "@tanstack/react-store"
import { authKeys, getCurrentUser } from "#/libs/api/auth.ts"
import { tokenStore } from "#/libs/auth/token-store.ts"

// The current session: resolves the principal via `GET /auth/me`, but only when a
// token is present (no token → idle, no request). TanStack Query + Store; no React
// hooks. A 401 (stale/invalid token) surfaces as the query's error.
export function useSession() {
	const token = useStore(tokenStore, (state) => state.token)
	return useQuery({
		queryKey: authKeys.me(),
		queryFn: getCurrentUser,
		enabled: token !== null,
		retry: false,
		staleTime: 60_000,
	})
}
