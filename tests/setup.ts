import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll } from "vitest"
import { server } from "./mocks/server.ts"

// jsdom doesn't implement scrollTo; TanStack Router's scroll restoration calls it.
beforeAll(() => {
	window.scrollTo = () => {}
	server.listen({ onUnhandledRequest: "error" })
})
afterEach(() => {
	cleanup()
	server.resetHandlers()
})
afterAll(() => server.close())
