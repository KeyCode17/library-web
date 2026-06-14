import { cn } from "#/libs/clsx/index.ts"
import type { TLoanStatus } from "#/routes/_authenticated/loans/_apis/index.ts"

const LABELS: Record<TLoanStatus, string> = {
	borrowed: "Borrowed",
	returned: "Returned",
	approved: "Approved",
}

export function LoanStatusBadge({ status }: { status: TLoanStatus }) {
	return <span className={cn("loan-badge", `loan-badge--${status}`)}>{LABELS[status]}</span>
}
