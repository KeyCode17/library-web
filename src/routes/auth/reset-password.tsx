import { createFileRoute } from "@tanstack/react-router"
import { ResetPasswordForm } from "./_components/reset-password-form.tsx"

// The emailed link points here with `?token=...`.
export const Route = createFileRoute("/auth/reset-password")({
	validateSearch: (search: Record<string, unknown>) => ({
		token: typeof search.token === "string" ? search.token : "",
	}),
	component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
	const { token } = Route.useSearch()
	return <ResetPasswordForm token={token} />
}
