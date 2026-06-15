import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys, type TUpdateMeRequest, updateMe } from "#/libs/api/auth.ts"

// `PATCH /auth/me` — update own email; writes the updated principal into the cache.
export function useUpdateMe() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["update-me"],
		mutationFn: (body: TUpdateMeRequest) => updateMe(body),
		onSuccess: (principal) => {
			queryClient.setQueryData(authKeys.me(), principal)
		},
	})
}
