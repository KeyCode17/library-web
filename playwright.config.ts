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
	// Start the real backend gateway (build it first if the binary is absent),
	// then Vite which proxies /api → the gateway. The gateway serves an in-memory
	// seeded catalogue, so no database needs provisioning.
	webServer: [
		{
			command:
				"sh -lc 'cd ../library-backend && (test -x target/debug/gateway || cargo build -p gateway) && exec target/debug/gateway'",
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
