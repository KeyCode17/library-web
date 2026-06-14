import { expect, test } from "@playwright/test"

// End-to-end IAM against the real gateway: register → (auto-login) → guarded
// account, then logout, guard enforcement, and explicit login.
test("register, reach the guarded account, log out, guard, and log back in", async ({ page }) => {
	const email = `e2e+${Date.now()}@example.com`
	const password = "password123"

	// register → auto-login → guarded account page
	await page.goto("/auth/register")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: /create account/i }).click()

	await expect(page).toHaveURL(/\/account$/)
	await expect(page.getByRole("heading", { level: 1, name: "Account" })).toBeVisible()
	await expect(page.getByText(email).first()).toBeVisible()
	await expect(page.getByText("member").first()).toBeVisible()

	// log out → anonymous on the catalogue
	await page.getByRole("button", { name: /log out/i }).click()
	await expect(page).toHaveURL(/\/catalog$/)
	await expect(page.getByRole("link", { name: /log in/i })).toBeVisible()

	// guard: the account route redirects an anonymous visitor to login
	await page.goto("/account")
	await expect(page).toHaveURL(/\/auth\/login$/)

	// explicit login with the same credentials → guarded account again
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: /sign in/i }).click()

	await expect(page).toHaveURL(/\/account$/)
	await expect(page.getByText(email).first()).toBeVisible()
})

test("catalog stays public (no auth required)", async ({ page }) => {
	await page.goto("/catalog")
	await expect(page.getByRole("heading", { level: 1, name: "Catalog" })).toBeVisible()
	await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible()
	// anonymous: login affordance present, not redirected
	await expect(page).toHaveURL(/\/catalog$/)
	await expect(page.getByRole("link", { name: /log in/i })).toBeVisible()
})
