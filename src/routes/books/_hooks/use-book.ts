import { useQuery } from "@tanstack/react-query"
import { isApiError } from "#/libs/errors/index.ts"
import { bookKeys, getBook } from "#/routes/books/_apis/index.ts"

// One hook per endpoint (skill §6): `GET /books/{id}`. Don't retry client errors
// (e.g. 404) — a missing book won't appear on retry; surface it immediately.
export function useBook(id: string) {
	return useQuery({
		queryKey: bookKeys.detail(id),
		queryFn: () => getBook(id),
		retry: (failureCount, error) => {
			if (isApiError(error) && error.status >= 400 && error.status < 500) return false
			return failureCount < 2
		},
	})
}
