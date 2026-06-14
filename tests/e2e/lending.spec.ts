import { expect, test } from "@playwright/test"

// End-to-end lending against the real gateway: register/login, borrow a book from
// its detail page, see it in My loans, and return it. The test returns the book at
// the end, leaving the seeded catalogue available for re-runs.
test("borrow a book, see it in my loans, and return it", async ({ page }) => {
	const email = `e2e-loan+${Date.now()}@example.com`
	const password = "password123"

	// register → auto-login
	await page.goto("/auth/register")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: /create account/i }).click()
	await expect(page).toHaveURL(/\/account$/)

	// open a book's detail and borrow it
	await page.goto("/catalog")
	await page.getByRole("link", { name: /Clean Code/ }).click()
	await expect(page).toHaveURL(/\/books\//)
	await page.getByRole("button", { name: "Borrow" }).click()
	await expect(page.getByRole("button", { name: "On loan" })).toBeVisible()

	// it appears in My loans as borrowed
	await page.getByRole("link", { name: /my loans/i }).click()
	await expect(page).toHaveURL(/\/loans$/)
	const row = page.locator("article.loan-row").filter({ hasText: "Clean Code" })
	await expect(row).toBeVisible()
	await expect(row.getByText("Borrowed")).toBeVisible()

	// return it
	await row.getByRole("button", { name: "Return" }).click()
	await expect(row.getByText("Returned")).toBeVisible()
})
