import { queryOptions } from "@tanstack/react-query"
import { authKeys, getCurrentUser } from "#/libs/api/auth.ts"

// Shared query options for the current principal — used by `useSession` (the
// hook) and by route `beforeLoad` guards (`ensureQueryData`) so they hit one cache.
export const meQueryOptions = queryOptions({
	queryKey: authKeys.me(),
	queryFn: getCurrentUser,
	retry: false,
	staleTime: 60_000,
})
