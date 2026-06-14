import type { RequestHandler } from "msw"

// No contract endpoints exist at M0. Per-feature handlers (typed against the
// generated schema) are added alongside each feature in T-001w and later.
export const handlers: RequestHandler[] = []
