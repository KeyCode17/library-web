import { Store } from "@tanstack/store"

// JWT persistence for this SPA.
//
// NOTE (future hardening): the bearer token is kept in localStorage so the
// session survives reload. That is acceptable here but is XSS-exposed; moving to
// an httpOnly, SameSite cookie issued by the backend is the planned hardening.
const STORAGE_KEY = "library.auth.token"

interface ITokenState {
	token: string | null
}

function readPersisted(): string | null {
	if (typeof localStorage === "undefined") return null
	return localStorage.getItem(STORAGE_KEY)
}

export const tokenStore = new Store<ITokenState>({ token: readPersisted() })

export function getToken(): string | null {
	return tokenStore.state.token
}

export function setToken(token: string): void {
	if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, token)
	tokenStore.setState(() => ({ token }))
}

export function clearToken(): void {
	if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY)
	tokenStore.setState(() => ({ token: null }))
}
