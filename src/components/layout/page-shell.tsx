import type { ReactNode } from "react"
import { AppBar } from "./app-bar.tsx"

interface IPageShellProps {
	children: ReactNode
	// The detail page omits the app-bar nav; everything else shows it.
	showNav?: boolean
}

// Standard page frame: the app-bar banner plus a single `<main>` landmark holding
// the screen content (so all content is contained by landmarks — a11y).
export function PageShell({ children, showNav }: IPageShellProps) {
	return (
		<div className="app">
			<AppBar showNav={showNav} />
			<main>{children}</main>
		</div>
	)
}
