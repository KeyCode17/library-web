import { QueryClient } from "@tanstack/react-query"

// Single QueryClient for the app. Shared between the React provider (main.tsx)
// and the router context (router.tsx) so loaders and components hit one cache.
let client: QueryClient | undefined

export function getQueryClient(): QueryClient {
	if (!client) {
		client = new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 30_000,
					refetchOnWindowFocus: false,
				},
			},
		})
	}
	return client
}
