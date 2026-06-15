import type { components } from "#/libs/api/schema"
import { ApiError, extractErrorMessage } from "#/libs/errors/index.ts"
import { api } from "./client.ts"

export type TCredentials = components["schemas"]["Credentials"]
export type TAuthToken = components["schemas"]["AuthToken"]
export type TPrincipal = components["schemas"]["Principal"]
export type TRole = components["schemas"]["Role"]
export type TChangePasswordRequest = components["schemas"]["ChangePasswordRequest"]
export type TUpdateMeRequest = components["schemas"]["UpdateMeRequest"]
export type TForgotPasswordRequest = components["schemas"]["ForgotPasswordRequest"]
export type TResetPasswordRequest = components["schemas"]["ResetPasswordRequest"]
export type TVerifyEmailRequest = components["schemas"]["VerifyEmailRequest"]
type TApiError = components["schemas"]["Error"]

function toApiError(error: unknown, status: number | undefined): ApiError {
	const body = error as TApiError | undefined
	return new ApiError(body?.message ?? extractErrorMessage(error), status ?? 0, body?.code)
}

// `POST /auth/register` — public self-registration, always creates a `member`.
export async function register(credentials: TCredentials): Promise<TPrincipal> {
	const { data, error, response } = await api.POST("/auth/register", { body: credentials })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `POST /auth/login` — exchange credentials for a JWT bearer token.
export async function login(credentials: TCredentials): Promise<TAuthToken> {
	const { data, error, response } = await api.POST("/auth/login", { body: credentials })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `GET /auth/me` — the current principal. The bearer token is attached by the
// client middleware; a missing/invalid token yields a 401 (ApiError.status).
export async function getCurrentUser(): Promise<TPrincipal> {
	const { data, error, response } = await api.GET("/auth/me")
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `POST /auth/change-password` — change own password (204).
export async function changePassword(body: TChangePasswordRequest): Promise<void> {
	const { error, response } = await api.POST("/auth/change-password", { body })
	if (error) throw toApiError(error, response?.status)
}

// `PATCH /auth/me` — update own email.
export async function updateMe(body: TUpdateMeRequest): Promise<TPrincipal> {
	const { data, error, response } = await api.PATCH("/auth/me", { body })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `DELETE /auth/me` — delete own account (204).
export async function deleteMe(): Promise<void> {
	const { error, response } = await api.DELETE("/auth/me")
	if (error) throw toApiError(error, response?.status)
}

// `POST /auth/forgot-password` — always 202 (no account enumeration); the only
// possible failure is a network/unexpected error.
export async function forgotPassword(body: TForgotPasswordRequest): Promise<void> {
	const { error } = await api.POST("/auth/forgot-password", { body })
	if (error) throw new Error(extractErrorMessage(error))
}

// `POST /auth/reset-password` — reset via emailed token (204); 400 if invalid/expired.
export async function resetPassword(body: TResetPasswordRequest): Promise<void> {
	const { error, response } = await api.POST("/auth/reset-password", { body })
	if (error) throw toApiError(error, response?.status)
}

// `POST /auth/verify-email` — verify via emailed token (204); 400 if invalid/expired.
export async function verifyEmail(body: TVerifyEmailRequest): Promise<void> {
	const { error, response } = await api.POST("/auth/verify-email", { body })
	if (error) throw toApiError(error, response?.status)
}

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
}
