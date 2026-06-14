import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
	resolve: {
		alias: {
			"#": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		// Manual vendor chunking (PRD perf metric): keep the React/TanStack runtime
		// in stable, long-cached chunks separate from app code and validators.
		// TanStack stays one chunk (router/query interdepend — splitting them is
		// circular).
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return undefined
					if (id.includes("@tanstack")) return "tanstack"
					if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) {
						return "react"
					}
					if (id.includes("/zod/") || id.includes("ts-pattern")) return "validation"
					return "vendor"
				},
			},
		},
	},
	server: {
		proxy: {
			// The gateway serves the contract paths at its root (e.g. /books), so
			// strip the /api prefix the browser uses: /api/books → :8080/books.
			// `ws: true` also proxies the chat WebSocket: /api/ws/chat → :8080/ws/chat.
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
})
