import { expect, test } from "@playwright/test"

// End-to-end recommendations against the real gateway: express a preference and
// submit, then see ranked books. Public — no login required.
test("submit preferences and see ranked recommendations", async ({ page }) => {
	await page.goto("/recommend")

	// idle prompt before submitting
	await expect(page.getByText(/tell us what you like/i)).toBeVisible()

	// prefer the Tech shelf, then rank
	await page.getByRole("button", { name: "Tech" }).click()
	await page.getByRole("button", { name: /get recommendations/i }).click()

	// ranked results render, top-ranked first
	await expect(page.locator(".rec-results article.book-card").first()).toBeVisible()
	await expect(page.getByText("#1")).toBeVisible()
	await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible()
})
