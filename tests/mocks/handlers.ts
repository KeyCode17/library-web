import { HttpResponse, http } from "msw"

// Default handlers. With cookie auth the app asks `GET /auth/me` on most screens
// (the app bar's auth menu, route guards); default it to 401 = anonymous, and let
// signed-in tests override it via `server.use(...)`.
export const handlers = [
	http.get("*/api/auth/me", () =>
		HttpResponse.json({ code: "unauthorized", message: "not signed in" }, { status: 401 }),
	),
]
