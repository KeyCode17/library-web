import type { components, operations } from "#/libs/api/schema"
import { ApiError, extractErrorMessage } from "#/libs/errors/index.ts"
import type { TPrincipal, TRole } from "./auth.ts"
import { api } from "./client.ts"

export type TUserSummary = components["schemas"]["UserSummary"]
export type TUserList = components["schemas"]["UserList"]
export type TCreateUserRequest = components["schemas"]["CreateUserRequest"]
export type TUpdateUserRequest = components["schemas"]["UpdateUserRequest"]
export type TListUsersParams = NonNullable<operations["listUsers"]["parameters"]["query"]>
type TApiError = components["schemas"]["Error"]

function toApiError(error: unknown, status: number | undefined): ApiError {
	const body = error as TApiError | undefined
	return new ApiError(body?.message ?? extractErrorMessage(error), status ?? 0, body?.code)
}

// `GET /users` — admin-only paginated user list.
export async function listUsers(params?: TListUsersParams): Promise<TUserList> {
	const { data, error, response } = await api.GET("/users", { params: { query: params } })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `POST /users` — admin creates a user.
export async function createUser(body: TCreateUserRequest): Promise<TUserSummary> {
	const { data, error, response } = await api.POST("/users", { body })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `PATCH /users/{id}` — admin updates a user's email and/or active flag.
export async function updateUser(id: string, body: TUpdateUserRequest): Promise<TUserSummary> {
	const { data, error, response } = await api.PATCH("/users/{id}", {
		params: { path: { id } },
		body,
	})
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `DELETE /users/{id}` — admin deletes a user (204).
export async function deleteUser(id: string): Promise<void> {
	const { error, response } = await api.DELETE("/users/{id}", { params: { path: { id } } })
	if (error) throw toApiError(error, response?.status)
}

// `POST /users/{id}/roles` — admin assigns a role.
export async function assignRole(id: string, role: TRole): Promise<TPrincipal> {
	const { data, error, response } = await api.POST("/users/{id}/roles", {
		params: { path: { id } },
		body: { role },
	})
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (params?: TListUsersParams) => [...userKeys.lists(), params ?? {}] as const,
}
