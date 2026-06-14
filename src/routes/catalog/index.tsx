import { createFileRoute } from "@tanstack/react-router"
import { CatalogScreen } from "./_components/catalog-screen.tsx"

export const Route = createFileRoute("/catalog/")({
	component: CatalogScreen,
})
