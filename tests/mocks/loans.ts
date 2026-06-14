import type { TLoan, TLoanList } from "#/libs/api/loans.ts"

let seq = 0

// Contract-shaped Loan factory (components.schemas.Loan). Defaults to an active
// loan with a far-future due date (never overdue in tests).
export function makeLoan(overrides: Partial<TLoan> = {}): TLoan {
	seq += 1
	return {
		id: `00000000-0000-4000-9000-${String(seq).padStart(12, "0")}`,
		book_id: "00000000-0000-4000-8000-000000000001",
		user_id: "11111111-1111-4111-8111-111111111111",
		status: "borrowed",
		borrowed_at: "2026-06-14T10:00:00Z",
		due_at: "2030-06-28T10:00:00Z",
		returned_at: null,
		approved_by: null,
		approved_at: null,
		...overrides,
	}
}

export function makeLoanList(loans: TLoan[]): TLoanList {
	return {
		data: loans,
		pagination: {
			page: 1,
			page_size: 20,
			total: loans.length,
			total_pages: loans.length === 0 ? 0 : 1,
		},
	}
}
