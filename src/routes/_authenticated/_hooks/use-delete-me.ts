import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteMe } from "#/libs/api/auth.ts"

// `DELETE /auth/me` — delete own account (the server invalidates the session);
// clear cached principal data so the UI returns to anonymous. 409 if deleting
// would lock out the last admin.
export function useDeleteMe() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["delete-me"],
		mutationFn: () => deleteMe(),
		onSuccess: () => {
			queryClient.clear()
		},
	})
}
