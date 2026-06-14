import { expect, test } from "@playwright/test"

// E2E smoke: the root route boots and renders the landing shell. The Playwright
// pre-push gate activates in T-001w (needs the backend running); at M0 it is
// configured but not part of the local gate.
test("root route renders the landing shell", async ({ page }) => {
	await page.goto("/")
	await expect(page.getByRole("heading", { name: "Library" })).toBeVisible()
})
