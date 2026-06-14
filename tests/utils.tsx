import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import type { ReactElement } from "react"

// Render a component under a fresh QueryClient with retries off, so error states
// surface immediately instead of after the default retry/backoff.
export function renderWithQuery(ui: ReactElement) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	})
	return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}
