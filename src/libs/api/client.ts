import createClient from "openapi-fetch"
import type { paths } from "./schema"

// Single client, typed against the generated OpenAPI `paths`. Auth is the httpOnly
// `session` cookie set by the backend on login — `credentials: "include"` sends it
// automatically. There is no JS-readable token (XSS-exposed localStorage removed).
// Feature `_apis/` modules wrap endpoints over this — plain functions, never hooks.
//
// `baseUrl` is "/api" in the browser (Vite proxies /api → the gateway, stripping
// the prefix). Tests set VITE_API_BASE_URL to an absolute origin so Node's fetch
// can parse the URL and MSW can intercept it.
export const api = createClient<paths>({
	baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",
	credentials: "include",
	// Resolve `globalThis.fetch` per call rather than capturing it at creation,
	// so test interceptors (MSW) installed after this module loads are honoured.
	fetch: (request: Request) => globalThis.fetch(request),
})
