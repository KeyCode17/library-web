import { useQuery } from "@tanstack/react-query"
import { listLoans, loanKeys, type TListLoansParams } from "#/libs/api/loans.ts"

// `GET /loans` — the current user's loans (or all loans for staff; server-decided).
export function useListLoans(params?: TListLoansParams) {
	return useQuery({
		queryKey: loanKeys.list(params),
		queryFn: () => listLoans(params),
		retry: false,
	})
}
