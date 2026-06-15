import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
	type TUpdateUserRequest,
	updateUser,
	userKeys,
} from "#/routes/_authenticated/admin/_apis/index.ts"

// `PATCH /users/{id}` — admin updates a user's email / active flag.
export function useUpdateUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["update-user"],
		mutationFn: ({ id, body }: { id: string; body: TUpdateUserRequest }) => updateUser(id, body),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
	})
}
