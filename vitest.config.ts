import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"#": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
		exclude: ["tests/e2e/**", "node_modules", "dist"],
		// Absolute base so Node's fetch can parse the URL and MSW can intercept it.
		// In the browser the client falls back to the relative "/api" proxy path.
		env: {
			VITE_API_BASE_URL: "http://localhost/api",
		},
	},
})
