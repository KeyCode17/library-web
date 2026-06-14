import type { TRole } from "#/libs/api/auth.ts"

// Cosmetic RBAC mirror (skill §10): the UI uses this to show/hide affordances.
// The server is always the authoritative boundary.
export function isStaff(role: TRole | undefined): boolean {
	return role === "admin" || role === "librarian"
}
