import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys, login, register, type TCredentials } from "#/routes/auth/_apis/index.ts"

// `POST /auth/register` then log in, so a successful registration lands the user
// authenticated. Login sets the session cookie; we refresh the session.
export function useRegister() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["register"],
		mutationFn: async (credentials: TCredentials) => {
			await register(credentials)
			return login(credentials)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.me() })
		},
	})
}
