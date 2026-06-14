import { createRouter } from "@tanstack/react-router"
import { getQueryClient } from "#/libs/tanstack-query/index.ts"
import { routeTree } from "#/routeTree.gen.ts"

// Single-tenant app (ADR-0004): no `$orgSlug` layer, one role axis.
// Context carries the shared QueryClient and the session (resolved once in
// `__root` `beforeLoad` later; null until auth lands).
export interface IRouterContext {
	queryClient: ReturnType<typeof getQueryClient>
	session: null
}

export const router = createRouter({
	routeTree,
	context: {
		queryClient: getQueryClient(),
		session: null,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
