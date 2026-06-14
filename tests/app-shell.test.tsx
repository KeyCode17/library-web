import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AppShell } from "#/components/layout/app-shell.tsx"

// Component-level smoke: proves Testing Library + jsdom render the skeleton.
describe("AppShell", () => {
	it("renders the landing heading", () => {
		render(<AppShell />)
		expect(screen.getByRole("heading", { name: "Library" })).toBeInTheDocument()
	})
})
