import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookKeys } from "#/libs/api/books.ts"
import { loanKeys, returnLoan } from "#/libs/api/loans.ts"

// `POST /loans/{id}/return` — return a borrowed loan; refreshes loans + books
// (the book becomes available again).
export function useReturnLoan() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["return-loan"],
		mutationFn: (id: string) => returnLoan(id),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: loanKeys.all }),
				queryClient.invalidateQueries({ queryKey: bookKeys.all }),
			])
		},
	})
}
