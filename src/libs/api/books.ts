import type { components, operations } from "#/libs/api/schema"
import { ApiError, extractErrorMessage } from "#/libs/errors/index.ts"
import { api } from "./client.ts"

export type TBook = components["schemas"]["Book"]
export type TPagination = components["schemas"]["Pagination"]
export type TBookList = components["schemas"]["BookList"]
export type TApiError = components["schemas"]["Error"]
export type TListBooksParams = NonNullable<operations["listBooks"]["parameters"]["query"]>

// `GET /books` with optional pagination + shelf/row finder params. Plain function
// (not a hook); the TanStack Query hook composes over it.
export async function listBooks(params?: TListBooksParams): Promise<TBookList> {
	const { data, error } = await api.GET("/books", { params: { query: params } })
	if (error || !data) throw new Error(extractErrorMessage(error))
	return data
}

// `GET /books/{id}` → Book, or throws an ApiError carrying the status so callers
// can distinguish 404 (not found) from other failures.
export async function getBook(id: string): Promise<TBook> {
	const { data, error, response } = await api.GET("/books/{id}", {
		params: { path: { id } },
	})
	if (error || !data) {
		const body = error as TApiError | undefined
		throw new ApiError(
			body?.message ?? extractErrorMessage(error),
			response?.status ?? 0,
			body?.code,
		)
	}
	return data
}

// One key factory for the whole book resource — shared by the list and detail
// features so cache reads/invalidations stay consistent (skill §5).
export const bookKeys = {
	all: ["books"] as const,
	lists: () => [...bookKeys.all, "list"] as const,
	list: (params?: TListBooksParams) => [...bookKeys.lists(), params ?? {}] as const,
	details: () => [...bookKeys.all, "detail"] as const,
	detail: (id: string) => [...bookKeys.details(), id] as const,
}
