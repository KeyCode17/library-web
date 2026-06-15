import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteMe } from "#/libs/api/auth.ts"
import { clearToken } from "#/libs/auth/token-store.ts"

// `DELETE /auth/me` — delete own account; clears the session on success (409 if
// the last admin would be locked out).
export function useDeleteMe() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["delete-me"],
		mutationFn: () => deleteMe(),
		onSuccess: () => {
			clearToken()
			queryClient.clear()
		},
	})
}
