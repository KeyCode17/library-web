import { Link } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { AuthCard } from "./auth-card.tsx"

export type TVerifyStatus = "ok" | "expired" | "invalid"

interface IVerifyEmailScreenProps {
	status: TVerifyStatus
}

// Email verification result (the POST runs in the route loader; this just renders
// the outcome).
export function VerifyEmailScreen({ status }: IVerifyEmailScreenProps) {
	return match(status)
		.with("ok", () => (
			<AuthCard title="Email verified" footer={<Link to="/account">Go to your account</Link>}>
				<p className="auth-note">Thanks — your email address is now verified.</p>
			</AuthCard>
		))
		.with("expired", () => (
			<AuthCard title="Link expired" footer={<Link to="/account">Back to your account</Link>}>
				<p className="form-error" role="alert">
					This verification link is invalid or has expired. Request a new one from your account.
				</p>
			</AuthCard>
		))
		.with("invalid", () => (
			<AuthCard title="Invalid link" footer={<Link to="/account">Back to your account</Link>}>
				<p className="form-error" role="alert">
					This verification link is missing its token.
				</p>
			</AuthCard>
		))
		.exhaustive()
}
