import { useQuery } from "@tanstack/react-query"
import {
	listUsers,
	type TListUsersParams,
	userKeys,
} from "#/routes/_authenticated/admin/_apis/index.ts"

// `GET /users` — admin-only paginated user list.
export function useListUsers(params?: TListUsersParams) {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: () => listUsers(params),
		retry: false,
	})
}
