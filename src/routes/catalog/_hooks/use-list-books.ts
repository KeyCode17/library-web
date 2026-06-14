import { useQuery } from "@tanstack/react-query"
import { bookKeys, listBooks, type TListBooksParams } from "#/routes/catalog/_apis/index.ts"

// One hook per endpoint (skill §6). Optional fetch — `useQuery`, not suspense —
// so the component owns the loading/error/empty/loaded states.
export function useListBooks(params?: TListBooksParams) {
	return useQuery({
		queryKey: bookKeys.list(params),
		queryFn: () => listBooks(params),
	})
}
