import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		baseURL: "http://localhost:5173",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	// Start the real backend gateway (which provisions a throwaway, freshly-seeded
	// Postgres in Docker — the gateway requires a DB and auto-migrates/seeds), then
	// Vite which proxies /api → the gateway.
	webServer: [
		{
			command: "sh scripts/start-gateway.sh",
			url: "http://localhost:8080/healthz",
			reuseExistingServer: !process.env.CI,
			timeout: 180_000,
		},
		{
			command: "pnpm dev",
			url: "http://localhost:5173",
			reuseExistingServer: !process.env.CI,
			timeout: 120_000,
		},
	],
})
