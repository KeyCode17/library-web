import type { TUserList, TUserSummary } from "#/libs/api/users.ts"

let seq = 0

export function makeUser(overrides: Partial<TUserSummary> = {}): TUserSummary {
	seq += 1
	return {
		id: `00000000-0000-4000-b000-${String(seq).padStart(12, "0")}`,
		email: `user${seq}@example.com`,
		role: "member",
		verified: true,
		active: true,
		created_at: "2026-06-15T08:00:00Z",
		...overrides,
	}
}

export function makeUserList(users: TUserSummary[]): TUserList {
	return {
		data: users,
		pagination: {
			page: 1,
			page_size: 20,
			total: users.length,
			total_pages: users.length === 0 ? 0 : 1,
		},
	}
}
