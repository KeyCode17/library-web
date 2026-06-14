import { useMutation, useQueryClient } from "@tanstack/react-query"
import { setToken } from "#/libs/auth/token-store.ts"
import { authKeys, login, register, type TCredentials } from "#/routes/auth/_apis/index.ts"

// `POST /auth/register` then immediately log in, so a successful registration
// lands the user authenticated.
export function useRegister() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["register"],
		mutationFn: async (credentials: TCredentials) => {
			await register(credentials)
			return login(credentials)
		},
		onSuccess: async (auth) => {
			setToken(auth.token)
			await queryClient.invalidateQueries({ queryKey: authKeys.me() })
		},
	})
}
