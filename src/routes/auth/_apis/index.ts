// The auth feature's API surface — the resource lives in the shared module
// (#/libs/api/auth.ts) so the header/session and route guards share its keys.

export type {
	TAuthToken,
	TChangePasswordRequest,
	TCredentials,
	TForgotPasswordRequest,
	TPrincipal,
	TResetPasswordRequest,
	TRole,
	TUpdateMeRequest,
	TVerifyEmailRequest,
} from "#/libs/api/auth.ts"
export {
	authKeys,
	changePassword,
	deleteMe,
	forgotPassword,
	getCurrentUser,
	login,
	register,
	resetPassword,
	updateMe,
	verifyEmail,
} from "#/libs/api/auth.ts"
