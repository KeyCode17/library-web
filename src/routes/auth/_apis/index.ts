// The auth feature's API surface — the resource lives in the shared module
// (#/libs/api/auth.ts) so the header/session and route guards share its keys.

export type { TAuthToken, TCredentials, TPrincipal, TRole } from "#/libs/api/auth.ts"
export { authKeys, getCurrentUser, login, register } from "#/libs/api/auth.ts"
