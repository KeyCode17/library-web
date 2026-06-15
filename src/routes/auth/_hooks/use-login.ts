import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys, login, type TCredentials } from "#/routes/auth/_apis/index.ts"

// `POST /auth/login` — the backend sets the httpOnly session cookie; we just
// refresh the session afterward (no JS token is stored). One hook per endpoint.
export function useLogin() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["login"],
		mutationFn: (credentials: TCredentials) => login(credentials),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.me() })
		},
	})
}
