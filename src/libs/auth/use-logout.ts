import { useQueryClient } from "@tanstack/react-query"
import { authKeys } from "#/libs/api/auth.ts"
import { clearToken } from "#/libs/auth/token-store.ts"

// Logout is purely client-side: drop the token (→ the session query disables) and
// evict cached principal data. Returns a plain handler (no React hooks).
export function useLogout() {
	const queryClient = useQueryClient()
	return () => {
		clearToken()
		queryClient.removeQueries({ queryKey: authKeys.all })
	}
}
