import { useMutation, useQueryClient } from "@tanstack/react-query"
import { setToken } from "#/libs/auth/token-store.ts"
import { authKeys, login, type TCredentials } from "#/routes/auth/_apis/index.ts"

// `POST /auth/login` → persist the token and refresh the session. One hook per
// endpoint (skill §6).
export function useLogin() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["login"],
		mutationFn: (credentials: TCredentials) => login(credentials),
		onSuccess: async (auth) => {
			setToken(auth.token)
			await queryClient.invalidateQueries({ queryKey: authKeys.me() })
		},
	})
}
