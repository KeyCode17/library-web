import { useMutation } from "@tanstack/react-query"
import { resetPassword, type TResetPasswordRequest } from "#/routes/auth/_apis/index.ts"

// `POST /auth/reset-password` — reset via the emailed token; 400 on invalid/expired.
export function useResetPassword() {
	return useMutation({
		mutationKey: ["reset-password"],
		mutationFn: (body: TResetPasswordRequest) => resetPassword(body),
	})
}
