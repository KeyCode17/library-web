import { match } from "ts-pattern"
import { PageShell } from "#/components/layout/page-shell.tsx"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { useListUsers } from "#/routes/_authenticated/admin/_hooks/use-list-users.ts"
import { CreateUserForm } from "./create-user-form.tsx"
import { UserRow } from "./user-row.tsx"

interface IManageUsersScreenProps {
	page?: number
	onPageChange?: (page: number) => void
}

// Admin-only user management: create + a paginated table with per-row role assign,
// email edit, activate/deactivate, and delete. Server enforces admin + last-admin
// guards; their errors surface per row.
export function ManageUsersScreen({ page = 1, onPageChange }: IManageUsersScreenProps) {
	const query = useListUsers({ page })

	return (
		<PageShell>
			<section className="head">
				<h1>Manage users</h1>
				<p>Create accounts, assign roles, and deactivate or remove users.</p>
			</section>
			<CreateUserForm />
			{match(query)
				.with({ status: "pending" }, () => (
					<p className="state-body" role="status" aria-label="Loading users">
						Loading users…
					</p>
				))
				.with({ status: "error" }, ({ error, refetch }) => (
					<div className="state-panel" role="alert">
						<h2 className="state-title">Couldn’t load users</h2>
						<p className="state-body">{extractErrorMessage(error)}</p>
						<button type="button" className="btn primary" onClick={() => refetch()}>
							Try again
						</button>
					</div>
				))
				.with({ status: "success" }, ({ data }) => (
					<>
						<table className="users-table">
							<thead>
								<tr>
									<th scope="col">Email</th>
									<th scope="col">Role</th>
									<th scope="col">Verified</th>
									<th scope="col">Active</th>
									<th scope="col">Actions</th>
								</tr>
							</thead>
							<tbody>
								{data.data.map((user) => (
									<UserRow key={user.id} user={user} />
								))}
							</tbody>
						</table>
						<nav className="pager" aria-label="Pagination">
							<button
								type="button"
								className="btn"
								disabled={data.pagination.page <= 1}
								onClick={() => onPageChange?.(data.pagination.page - 1)}
							>
								Previous
							</button>
							<span className="pager-info">
								Page {data.pagination.page} of {Math.max(1, data.pagination.total_pages)}
							</span>
							<button
								type="button"
								className="btn"
								disabled={data.pagination.page >= data.pagination.total_pages}
								onClick={() => onPageChange?.(data.pagination.page + 1)}
							>
								Next
							</button>
						</nav>
					</>
				))
				.exhaustive()}
		</PageShell>
	)
}
