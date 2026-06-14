import { expect, test } from "@playwright/test"

// End-to-end against the real gateway (Playwright's webServer starts it and Vite,
// which proxies /api → the gateway). The root redirects to /catalog and the
// catalogue renders from live, seeded data.
test("catalog list renders books from the running backend", async ({ page }) => {
	await page.goto("/")

	// redirected to the catalogue
	await expect(page).toHaveURL(/\/catalog$/)
	await expect(page.getByRole("heading", { level: 1, name: "Catalog" })).toBeVisible()

	// a seeded book from the gateway's in-memory catalogue
	await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible()

	// the loaded grid has at least one card, and the count is populated
	await expect(page.locator("article.book-card").first()).toBeVisible()
	await expect(page.locator(".count")).toContainText(/\d+ books?/)
})
