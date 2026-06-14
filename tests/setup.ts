import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll } from "vitest"
import { clearToken } from "#/libs/auth/token-store.ts"
import { server } from "./mocks/server.ts"

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => {
	cleanup()
	server.resetHandlers()
	clearToken()
	localStorage.clear()
})
afterAll(() => server.close())
