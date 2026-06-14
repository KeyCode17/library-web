import { createFileRoute } from "@tanstack/react-router"
import { AccountScreen } from "./_components/account-screen.tsx"

export const Route = createFileRoute("/_authenticated/account")({
	component: AccountScreen,
})
