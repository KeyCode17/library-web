import { expect, test } from "@playwright/test"

// Cookie session: register sets the httpOnly `session` cookie; the session must
// survive a full page reload with no JS token in play.
test("the session persists across a reload via the cookie", async ({ page }) => {
	const email = `e2e-cookie+${Date.now()}@example.com`

	await page.goto("/auth/register")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill("password123")
	await page.getByRole("button", { name: /create account/i }).click()
	await expect(page).toHaveURL(/\/account$/)
	await expect(page.getByText(email).first()).toBeVisible()

	// hard reload — no JS token survives; only the cookie does
	await page.reload()
	await expect(page).toHaveURL(/\/account$/)
	await expect(page.getByText(email).first()).toBeVisible()

	// logout clears the cookie; the guarded route then redirects to login
	await page.getByRole("button", { name: /log out/i }).click()
	await expect(page).toHaveURL(/\/catalog$/)
	await page.goto("/account")
	await expect(page).toHaveURL(/\/auth\/login$/)
})

test("the app-bar search filters the catalogue via GET /books?q=", async ({ page }) => {
	await page.goto("/catalog")
	await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible()
	// a different seeded book is present before searching
	await expect(page.getByRole("heading", { name: "Dune" })).toBeVisible()

	const search = page.getByLabel("Search the catalogue")
	await search.fill("clean")
	await search.press("Enter")

	await expect(page).toHaveURL(/\/catalog\?q=clean$/)
	await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible()
	await expect(page.getByRole("heading", { name: "Dune" })).toHaveCount(0)
})
