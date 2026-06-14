import { createFileRoute } from "@tanstack/react-router"
import { RecommendScreen } from "./_components/recommend-screen.tsx"

export const Route = createFileRoute("/recommend/")({
	component: RecommendScreen,
})
