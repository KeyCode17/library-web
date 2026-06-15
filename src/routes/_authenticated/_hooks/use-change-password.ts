import { useMutation } from "@tanstack/react-query"
import { changePassword, type TChangePasswordRequest } from "#/libs/api/auth.ts"

// `POST /auth/change-password` — change own password (401 on wrong current).
export function useChangePassword() {
	return useMutation({
		mutationKey: ["change-password"],
		mutationFn: (body: TChangePasswordRequest) => changePassword(body),
	})
}
