import { describe, expect, it } from "vitest"

// Trivial smoke test: proves the Vitest toolchain runs green. Real behaviour
// tests arrive with features.
describe("toolchain smoke", () => {
	it("runs vitest", () => {
		expect(1 + 1).toBe(2)
	})
})
