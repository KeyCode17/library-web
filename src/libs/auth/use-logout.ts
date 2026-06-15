import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys, logout } from "#/libs/api/auth.ts"

// `POST /auth/logout` clears the session cookie server-side; then drop cached
// principal data so the UI returns to the anonymous state. Returns a mutation.
export function useLogout() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["logout"],
		mutationFn: () => logout(),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: authKeys.all })
		},
	})
}
