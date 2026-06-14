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

test("navigates from the list to a book's detail", async ({ page }) => {
	await page.goto("/catalog")

	// click the seeded "Clean Code" card → its detail route
	await page.getByRole("link", { name: /Clean Code/ }).click()

	await expect(page).toHaveURL(/\/books\/[0-9a-f-]+$/)
	await expect(page.getByRole("heading", { level: 1, name: "Clean Code" })).toBeVisible()
	await expect(page.getByText("Find it on the shelf")).toBeVisible()
	// breadcrumb back to the catalogue works
	await page.getByRole("link", { name: "Catalog" }).click()
	await expect(page).toHaveURL(/\/catalog$/)
})

test("shows not-found for a missing book id", async ({ page }) => {
	await page.goto("/books/00000000-0000-4000-8000-999999999999")
	await expect(page.getByRole("heading", { name: /book not found/i })).toBeVisible()
})
