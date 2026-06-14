import { match } from "ts-pattern"
import type { TLoan } from "#/routes/_authenticated/loans/_apis/index.ts"
import { LoanStatusBadge } from "./loan-status-badge.tsx"

interface ILoanRowProps {
	loan: TLoan
	bookTitle: string
	isStaff: boolean
	busy: boolean
	onReturn: (id: string) => void
	onApprove: (id: string) => void
}

const dateOnly = (iso: string) => iso.slice(0, 10)

function isOverdue(loan: TLoan): boolean {
	return loan.status === "borrowed" && new Date(loan.due_at).getTime() < Date.now()
}

// One loan as a card: book title, status, dates, and the contextual action —
// Return for a borrowed loan; Approve (staff only) for a returned one.
export function LoanRow({ loan, bookTitle, isStaff, busy, onReturn, onApprove }: ILoanRowProps) {
	return (
		<article className="loan-row">
			<div className="loan-main">
				<h2 className="loan-title">{bookTitle}</h2>
				<div className="loan-meta">
					<LoanStatusBadge status={loan.status} />
					<span className="loan-due">
						Due {dateOnly(loan.due_at)}
						{isOverdue(loan) && <span className="loan-overdue"> · Overdue</span>}
					</span>
				</div>
			</div>
			<div className="loan-actions">
				{match(loan.status)
					.with("borrowed", () => (
						<button type="button" className="btn" disabled={busy} onClick={() => onReturn(loan.id)}>
							Return
						</button>
					))
					.with("returned", () =>
						isStaff ? (
							<button
								type="button"
								className="btn primary"
								disabled={busy}
								onClick={() => onApprove(loan.id)}
							>
								Approve
							</button>
						) : (
							<span className="loan-note">Awaiting approval</span>
						),
					)
					.with("approved", () => <span className="loan-note">Closed</span>)
					.exhaustive()}
			</div>
		</article>
	)
}
