import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "#/libs/api/auth.ts"
import { assignRole, type TRole, userKeys } from "#/routes/_authenticated/admin/_apis/index.ts"

// `POST /users/{id}/roles` — admin assigns a role; refreshes the list and the
// current session (the admin may have changed their own role).
export function useAssignRole() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["assign-role"],
		mutationFn: ({ id, role }: { id: string; role: TRole }) => assignRole(id, role),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userKeys.all }),
				queryClient.invalidateQueries({ queryKey: authKeys.me() }),
			])
		},
	})
}
