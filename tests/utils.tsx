import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router"
import { render } from "@testing-library/react"
import { routeTree } from "#/routeTree.gen.ts"

// Render the real route tree at a given path under a fresh QueryClient + memory
// history. Retries are off (and zero-delay) so error states surface immediately.
export function renderRoute(initialPath: string) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, retryDelay: 0 } },
	})
	const router = createRouter({
		routeTree,
		context: { queryClient, session: null },
		history: createMemoryHistory({ initialEntries: [initialPath] }),
	})
	const result = render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	)
	return { router, queryClient, ...result }
}
