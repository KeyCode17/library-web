import { useQuery } from "@tanstack/react-query"
import { match } from "ts-pattern"
import { AppBar } from "#/components/layout/app-bar.tsx"
import { bookKeys, listBooks } from "#/libs/api/books.ts"
import { isStaff } from "#/libs/auth/roles.ts"
import { useSession } from "#/libs/auth/use-session.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { useApproveLoan } from "#/routes/_authenticated/loans/_hooks/use-approve-loan.ts"
import { useListLoans } from "#/routes/_authenticated/loans/_hooks/use-list-loans.ts"
import { useReturnLoan } from "#/routes/_authenticated/loans/_hooks/use-return-loan.ts"
import { LoanRow } from "./loan-row.tsx"

// The lending view. Members see their own loans (Return); staff (librarian/admin)
// see all loans and can Approve returned ones. The header title reflects the role.
export function LoansScreen() {
	const loansQuery = useListLoans()
	const booksQuery = useQuery({
		queryKey: bookKeys.list({ page_size: 100 }),
		queryFn: () => listBooks({ page_size: 100 }),
	})
	const session = useSession()
	const staff = isStaff(session.data?.role)

	const returnLoanMutation = useReturnLoan()
	const approveLoanMutation = useApproveLoan()
	const busyId = returnLoanMutation.isPending
		? returnLoanMutation.variables
		: approveLoanMutation.isPending
			? approveLoanMutation.variables
			: undefined

	const titleById = new Map((booksQuery.data?.data ?? []).map((book) => [book.id, book.title]))

	return (
		<div className="app">
			<AppBar />
			<section className="head">
				<h1>{staff ? "All loans" : "My loans"}</h1>
				<p>{staff ? "Every active and closed loan." : "Books you've borrowed."}</p>
			</section>
			{match(loansQuery)
				.with({ status: "pending" }, () => (
					<p className="state-body" role="status">
						Loading loans…
					</p>
				))
				.with({ status: "error" }, ({ error, refetch }) => (
					<div className="state-panel" role="alert">
						<h2 className="state-title">Couldn’t load loans</h2>
						<p className="state-body">{extractErrorMessage(error)}</p>
						<button type="button" className="btn primary" onClick={() => refetch()}>
							Try again
						</button>
					</div>
				))
				.with({ status: "success" }, ({ data }) =>
					data.data.length === 0 ? (
						<div className="state-panel">
							<h2 className="state-title">No loans yet</h2>
							<p className="state-body">Borrow a book from the catalogue to start a loan.</p>
						</div>
					) : (
						<div className="loans">
							{data.data.map((loan) => (
								<LoanRow
									key={loan.id}
									loan={loan}
									bookTitle={titleById.get(loan.book_id) ?? loan.book_id}
									isStaff={staff}
									busy={busyId === loan.id}
									onReturn={(id) => returnLoanMutation.mutate(id)}
									onApprove={(id) => approveLoanMutation.mutate(id)}
								/>
							))}
						</div>
					),
				)
				.exhaustive()}
		</div>
	)
}
