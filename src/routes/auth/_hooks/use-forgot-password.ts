import { useMutation } from "@tanstack/react-query"
import { forgotPassword, type TForgotPasswordRequest } from "#/routes/auth/_apis/index.ts"

// `POST /auth/forgot-password` — the response is always neutral (no account
// enumeration); the UI shows the same confirmation regardless.
export function useForgotPassword() {
	return useMutation({
		mutationKey: ["forgot-password"],
		mutationFn: (body: TForgotPasswordRequest) => forgotPassword(body),
	})
}
