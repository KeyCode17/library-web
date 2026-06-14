import type { components } from "#/libs/api/schema"
import { ApiError, extractErrorMessage } from "#/libs/errors/index.ts"
import { api } from "./client.ts"

export type TCredentials = components["schemas"]["Credentials"]
export type TAuthToken = components["schemas"]["AuthToken"]
export type TPrincipal = components["schemas"]["Principal"]
export type TRole = components["schemas"]["Role"]
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

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
}
