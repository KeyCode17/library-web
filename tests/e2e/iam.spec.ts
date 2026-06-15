import { expect, test } from "@playwright/test"

// The gateway seeds this admin (scripts/start-gateway.sh sets IAM_ADMIN_PASSWORD).
const ADMIN_EMAIL = "admin@library.local"
const ADMIN_PASSWORD = "admin-password-123"

async function login(page: import("@playwright/test").Page, email: string, password: string) {
	await page.goto("/auth/login")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: /sign in/i }).click()
	await expect(page).toHaveURL(/\/account$/)
}

test("admin creates a user and changes their role", async ({ page }) => {
	const userEmail = `e2e-managed+${Date.now()}@example.com`

	await login(page, ADMIN_EMAIL, ADMIN_PASSWORD)

	// open Manage Users from the app bar
	await page
		.getByRole("link", { name: /manage users/i })
		.first()
		.click()
	await expect(page).toHaveURL(/\/admin\/users$/)
	await expect(page.getByRole("heading", { level: 1, name: "Manage users" })).toBeVisible()

	// create a member
	const createForm = page.locator("section", { hasText: "Create user" })
	await createForm.getByLabel("Email").fill(userEmail)
	await createForm.getByLabel("Password").fill("password123")
	await createForm.getByLabel("Role").selectOption("member")
	await createForm.getByRole("button", { name: /create user/i }).click()

	// the new user appears; promote them to librarian
	const roleSelect = page.getByLabel(`Role for ${userEmail}`)
	await expect(roleSelect).toBeVisible()
	await roleSelect.selectOption("librarian")
	await expect(roleSelect).toHaveValue("librarian")
})

test("a member changes their own password", async ({ page }) => {
	const email = `e2e-pw+${Date.now()}@example.com`
	const password = "password123"
	const newPassword = "password456"

	// register → account
	await page.goto("/auth/register")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: /create account/i }).click()
	await expect(page).toHaveURL(/\/account$/)

	// change password
	const section = page.locator("section", { hasText: "Change password" })
	await section.getByLabel("Current password").fill(password)
	await section.getByLabel("New password").fill(newPassword)
	await section.getByRole("button", { name: /update password/i }).click()
	await expect(section.getByText(/password changed/i)).toBeVisible()
})
