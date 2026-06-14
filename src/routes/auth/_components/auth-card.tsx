import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

interface IAuthCardProps {
	title: string
	subtitle?: string
	children: ReactNode
	footer: ReactNode
}

// Centered card shell for the auth screens. No bespoke login design exists — this
// is a clean default built on the existing tokens; see README (needs a design pass).
export function AuthCard({ title, subtitle, children, footer }: IAuthCardProps) {
	return (
		<div className="auth-page">
			<Link to="/catalog" className="wordmark auth-brand">
				Stacks<span className="dot">.</span>
			</Link>
			<div className="auth-card">
				<h1 className="auth-title">{title}</h1>
				{subtitle && <p className="auth-sub">{subtitle}</p>}
				{children}
				<p className="auth-foot">{footer}</p>
			</div>
		</div>
	)
}
