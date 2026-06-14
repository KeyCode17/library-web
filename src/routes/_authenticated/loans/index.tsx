import { createFileRoute } from "@tanstack/react-router"
import { LoansScreen } from "./_components/loans-screen.tsx"

export const Route = createFileRoute("/_authenticated/loans/")({
	component: LoansScreen,
})
