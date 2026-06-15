import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

interface IAuthCardProps {
	title: string
	subtitle?: string
	children: ReactNode
	footer: ReactNode
}

// Centered card shell for the auth screens, built to the Stacks design tokens
// (design: docs/designs/login.html, register.html, forgot-password.html, etc.).
export function AuthCard({ title, subtitle, children, footer }: IAuthCardProps) {
	return (
		<main className="auth-page">
			<Link to="/catalog" className="wordmark auth-brand">
				Stacks<span className="dot">.</span>
			</Link>
			<div className="auth-card">
				<h1 className="auth-title">{title}</h1>
				{subtitle && <p className="auth-sub">{subtitle}</p>}
				{children}
				<p className="auth-foot">{footer}</p>
			</div>
		</main>
	)
}
