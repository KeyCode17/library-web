import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
	createUser,
	type TCreateUserRequest,
	userKeys,
} from "#/routes/_authenticated/admin/_apis/index.ts"

// `POST /users` — admin creates a user; refreshes the list.
export function useCreateUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["create-user"],
		mutationFn: (body: TCreateUserRequest) => createUser(body),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
	})
}
