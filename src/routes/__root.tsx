import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import type { IRouterContext } from "#/router.tsx"

export const Route = createRootRouteWithContext<IRouterContext>()({
	component: RootLayout,
})

function RootLayout() {
	return <Outlet />
}
