import createClient from "openapi-fetch"
import type { paths } from "./schema"

// Single cookie-credentialed client, typed against the generated OpenAPI `paths`.
// Feature `_apis/` modules wrap endpoints over this — they are plain functions,
// never hooks. See the tanstack-frontend skill §3.
export const api = createClient<paths>({
	baseUrl: "/api/v1",
	credentials: "include",
})
