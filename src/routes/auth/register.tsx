import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "./_components/register-form.tsx"

export const Route = createFileRoute("/auth/register")({
	component: RegisterForm,
})
