import { setupServer } from "msw/node"
import { handlers } from "./handlers.ts"

// Node request-mocking server used by Vitest (jsdom). Browser/E2E mocking is
// wired separately when the contract lands.
export const server = setupServer(...handlers)
