import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "./_components/login-form.tsx"

export const Route = createFileRoute("/auth/login")({
	component: LoginForm,
})
