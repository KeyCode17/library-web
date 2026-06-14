import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookKeys } from "#/libs/api/books.ts"
import { borrowBook, loanKeys } from "#/libs/api/loans.ts"

// `POST /loans` — borrow the given book. On success, refresh both the book caches
// (the book flips unavailable) and the loan lists.
export function useBorrowBook() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["borrow-book"],
		mutationFn: (bookId: string) => borrowBook({ book_id: bookId }),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: bookKeys.all }),
				queryClient.invalidateQueries({ queryKey: loanKeys.all }),
			])
		},
	})
}
