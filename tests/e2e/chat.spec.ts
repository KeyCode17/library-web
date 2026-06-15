import { expect, test } from "@playwright/test"

// End-to-end chat against the real gateway: register/login, open a room (the
// WebSocket connects through Vite's /api proxy), send a message, and see the
// server's broadcast of it (a single client seeing its own message is sufficient).
test("open a room, send a message, and see it broadcast back", async ({ page }) => {
	const email = `e2e-chat+${Date.now()}@example.com`
	const password = "password123"
	const message = `hello-${Date.now()}`

	// register → auto-login
	await page.goto("/auth/register")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: /create account/i }).click()
	await expect(page).toHaveURL(/\/account$/)

	// open the ask-a-librarian room
	await page.goto("/chat")
	await page.getByRole("link", { name: /ask a librarian/i }).click()
	await expect(page).toHaveURL(/\/chat\/ask-a-librarian$/)

	// the socket connects (status flips to Live)
	await expect(page.locator(".chat-status")).toHaveText("Live", { timeout: 15_000 })

	// send a message → the gateway broadcasts it back to us. The WS round-trip can
	// be slow when the whole E2E suite shares one gateway, so allow extra time.
	await page.getByLabel("Message").fill(message)
	await page.getByRole("button", { name: "Send" }).click()
	await expect(page.getByText(message)).toBeVisible({ timeout: 15_000 })
})
