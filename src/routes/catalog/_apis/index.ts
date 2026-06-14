import { api } from "#/libs/api/client.ts"
import type { components, operations } from "#/libs/api/schema"
import { extractErrorMessage } from "#/libs/errors/index.ts"

export type TBook = components["schemas"]["Book"]
export type TPagination = components["schemas"]["Pagination"]
export type TBookList = components["schemas"]["BookList"]
export type TListBooksParams = NonNullable<operations["listBooks"]["parameters"]["query"]>

// Typed wrapper over `GET /books`. Plain function (not a hook) — the TanStack
// Query hook composes over it. Throws a normalised message on any error.
export async function listBooks(params?: TListBooksParams): Promise<TBookList> {
	const { data, error } = await api.GET("/books", { params: { query: params } })
	if (error || !data) throw new Error(extractErrorMessage(error))
	return data
}

// Query key factory — never inline keys (skill §5).
export const bookKeys = {
	all: ["books"] as const,
	lists: () => [...bookKeys.all, "list"] as const,
	list: (params?: TListBooksParams) => [...bookKeys.lists(), params ?? {}] as const,
}
