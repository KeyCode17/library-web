import { createFileRoute, redirect } from "@tanstack/react-router"
import { meQueryOptions } from "#/libs/auth/session.ts"
import { ManageUsersScreen } from "./_components/manage-users-screen.tsx"

// Admin-only. The `_authenticated` layout already guarantees a token; here we
// resolve the principal and gate on the admin role (UX — the server enforces it
// on every /users call regardless).
export const Route = createFileRoute("/_authenticated/admin/users")({
	validateSearch: (search: Record<string, unknown>): { page?: number } => {
		const page = Number(search.page)
		return Number.isInteger(page) && page >= 1 ? { page } : {}
	},
	beforeLoad: async ({ context }) => {
		const me = await context.queryClient.ensureQueryData(meQueryOptions).catch(() => null)
		if (!me) throw redirect({ to: "/auth/login" })
		if (me.role !== "admin") throw redirect({ to: "/account" })
	},
	component: ManageUsersRoute,
})

function ManageUsersRoute() {
	const { page } = Route.useSearch()
	const navigate = Route.useNavigate()
	return (
		<ManageUsersScreen page={page} onPageChange={(next) => navigate({ search: { page: next } })} />
	)
}
