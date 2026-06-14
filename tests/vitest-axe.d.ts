import type { AxeMatchers } from "vitest-axe/matchers"

// Register vitest-axe's matchers on vitest's assertion types (the runtime
// extension is done via `expect.extend` in the a11y test).
declare module "vitest" {
	interface Assertion extends AxeMatchers {}
	interface AsymmetricMatchersContaining extends AxeMatchers {}
}
