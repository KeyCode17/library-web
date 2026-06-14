import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveLoan, loanKeys } from "#/libs/api/loans.ts"

// `POST /loans/{id}/approve` — staff close a returned loan. Server enforces the
// staff requirement; the UI only shows this to staff.
export function useApproveLoan() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["approve-loan"],
		mutationFn: (id: string) => approveLoan(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: loanKeys.all })
		},
	})
}
