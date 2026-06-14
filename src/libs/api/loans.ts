import type { components, operations } from "#/libs/api/schema"
import { ApiError, extractErrorMessage } from "#/libs/errors/index.ts"
import { api } from "./client.ts"

export type TLoan = components["schemas"]["Loan"]
export type TLoanStatus = components["schemas"]["LoanStatus"]
export type TLoanList = components["schemas"]["LoanList"]
export type TBorrowRequest = components["schemas"]["BorrowRequest"]
export type TListLoansParams = NonNullable<operations["listLoans"]["parameters"]["query"]>
type TApiError = components["schemas"]["Error"]

function toApiError(error: unknown, status: number | undefined): ApiError {
	const body = error as TApiError | undefined
	return new ApiError(body?.message ?? extractErrorMessage(error), status ?? 0, body?.code)
}

// `GET /loans` — a member sees their own loans; staff see all (server-decided).
export async function listLoans(params?: TListLoansParams): Promise<TLoanList> {
	const { data, error, response } = await api.GET("/loans", { params: { query: params } })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `POST /loans` — borrow a book (opens an active loan, flips the book unavailable).
export async function borrowBook(body: TBorrowRequest): Promise<TLoan> {
	const { data, error, response } = await api.POST("/loans", { body })
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `POST /loans/{id}/return` — the borrower (or staff) returns a borrowed loan.
export async function returnLoan(id: string): Promise<TLoan> {
	const { data, error, response } = await api.POST("/loans/{id}/return", {
		params: { path: { id } },
	})
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

// `POST /loans/{id}/approve` — staff confirm a returned loan, closing it.
export async function approveLoan(id: string): Promise<TLoan> {
	const { data, error, response } = await api.POST("/loans/{id}/approve", {
		params: { path: { id } },
	})
	if (error || !data) throw toApiError(error, response?.status)
	return data
}

export const loanKeys = {
	all: ["loans"] as const,
	lists: () => [...loanKeys.all, "list"] as const,
	list: (params?: TListLoansParams) => [...loanKeys.lists(), params ?? {}] as const,
}
