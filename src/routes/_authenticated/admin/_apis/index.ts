// The admin user-management API surface — the resource lives in #/libs/api/users.ts.

export type { TRole } from "#/libs/api/auth.ts"
export type {
	TCreateUserRequest,
	TListUsersParams,
	TUpdateUserRequest,
	TUserList,
	TUserSummary,
} from "#/libs/api/users.ts"
export {
	assignRole,
	createUser,
	deleteUser,
	listUsers,
	updateUser,
	userKeys,
} from "#/libs/api/users.ts"
