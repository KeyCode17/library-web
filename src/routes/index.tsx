import { createFileRoute, redirect } from "@tanstack/react-router"

// The catalog is the app's primary screen; send the root to it.
export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/catalog" })
	},
})
