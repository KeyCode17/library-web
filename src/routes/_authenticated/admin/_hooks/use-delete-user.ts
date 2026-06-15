import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUser, userKeys } from "#/routes/_authenticated/admin/_apis/index.ts"

// `DELETE /users/{id}` — admin deletes a user; refreshes the list.
export function useDeleteUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["delete-user"],
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
	})
}
