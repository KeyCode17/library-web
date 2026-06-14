// The loans view API surface — the resource lives in #/libs/api/loans.ts (shared
// with the detail page's borrow action, so cache keys stay consistent).

export type { TLoan, TLoanList, TLoanStatus } from "#/libs/api/loans.ts"
export { approveLoan, borrowBook, listLoans, loanKeys, returnLoan } from "#/libs/api/loans.ts"
