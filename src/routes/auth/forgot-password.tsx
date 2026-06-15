import { createFileRoute } from "@tanstack/react-router"
import { ForgotPasswordForm } from "./_components/forgot-password-form.tsx"

export const Route = createFileRoute("/auth/forgot-password")({
	component: ForgotPasswordForm,
})
