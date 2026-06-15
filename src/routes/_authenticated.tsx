import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { meQueryOptions } from "#/libs/auth/session.ts"

// Pathless layout guard for authenticated-only routes. The catalogue is NOT under
// this layout — it stays public. With cookie auth there is no token to check
// synchronously, so we resolve `GET /auth/me` (sent via the session cookie); a 401
// means anonymous → redirect to login. The server is the authoritative boundary.
export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const me = await context.queryClient.ensureQueryData(meQueryOptions).catch(() => null)
		if (!me) {
			throw redirect({ to: "/auth/login" })
		}
	},
	component: () => <Outlet />,
})
