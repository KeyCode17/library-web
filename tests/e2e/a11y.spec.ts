import AxeBuilder from "@axe-core/playwright"
import { expect, type Page, test } from "@playwright/test"

// Real-browser axe pass (catches what jsdom can't — colour contrast, focus).
async function expectNoViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
		.analyze()
	expect(results.violations).toEqual([])
}

const SEED_BOOK = "00000000-0000-4000-8000-000000000001"

test("anonymous screens have no a11y violations", async ({ page }) => {
	await page.goto("/catalog")
	await expect(page.getByRole("heading", { name: "Clean Code" })).toBeVisible()
	await expectNoViolations(page)

	await page.goto(`/books/${SEED_BOOK}`)
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
	await expectNoViolations(page)

	await page.goto("/auth/login")
	await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
	await expectNoViolations(page)

	await page.goto("/auth/register")
	await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible()
	await expectNoViolations(page)

	await page.goto("/recommend")
	await expect(page.getByRole("heading", { level: 1, name: "Recommendations" })).toBeVisible()
	await expectNoViolations(page)
})

test("authenticated screens have no a11y violations", async ({ page }) => {
	const email = `e2e-a11y+${Date.now()}@example.com`
	await page.goto("/auth/register")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill("password123")
	await page.getByRole("button", { name: /create account/i }).click()
	await expect(page).toHaveURL(/\/account$/)
	await expectNoViolations(page)

	await page.goto("/loans")
	await expect(page.getByRole("heading", { level: 1, name: "My loans" })).toBeVisible()
	await expectNoViolations(page)

	await page.goto("/chat")
	await expect(page.getByRole("heading", { level: 1, name: "Chat rooms" })).toBeVisible()
	await expectNoViolations(page)

	await page.goto("/chat/ask-a-librarian")
	await expect(page.locator(".chat-status")).toHaveText("Live")
	await expectNoViolations(page)
})
