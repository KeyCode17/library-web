import { createFileRoute } from "@tanstack/react-router"
import { verifyEmail } from "#/routes/auth/_apis/index.ts"
import { type TVerifyStatus, VerifyEmailScreen } from "./_components/verify-email-screen.tsx"

// The emailed link points here with `?token=...`. The verification POST runs in
// the loader (lifecycle outside React — no `useEffect`), once per real navigation.
export const Route = createFileRoute("/auth/verify-email")({
	validateSearch: (search: Record<string, unknown>) => ({
		token: typeof search.token === "string" ? search.token : "",
	}),
	loaderDeps: ({ search }) => ({ token: search.token }),
	loader: async ({ deps, preload }): Promise<{ status: TVerifyStatus }> => {
		if (preload) return { status: "invalid" }
		if (!deps.token) return { status: "invalid" }
		try {
			await verifyEmail({ token: deps.token })
			return { status: "ok" }
		} catch {
			return { status: "expired" }
		}
	},
	component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
	const { status } = Route.useLoaderData()
	return <VerifyEmailScreen status={status} />
}
