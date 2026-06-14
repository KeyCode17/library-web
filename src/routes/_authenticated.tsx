import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getToken } from "#/libs/auth/token-store.ts"

// Pathless layout guard for authenticated-only routes. The catalogue is NOT under
// this layout — it stays public. The token check is a UX gate; the server is the
// authoritative boundary (every /auth/me and protected call validates the JWT).
export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		if (getToken() === null) {
			throw redirect({ to: "/auth/login" })
		}
	},
	component: () => <Outlet />,
})
