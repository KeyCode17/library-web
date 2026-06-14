import { cn } from "#/libs/clsx/index.ts"
import { AuthMenu } from "./auth-menu.tsx"

interface IAppBarProps {
	// The detail design omits the nav; the list shows it.
	showNav?: boolean
}

// Application bar (design `.appbar`): wordmark, search, optional nav, auth menu.
//
// Search and the secondary nav items (Borrowed, Chat) are presentational — the
// contract exposes neither search nor those screens yet, so they are rendered for
// design fidelity without faking behaviour. The auth menu (sign-in state) is live.
export function AppBar({ showNav = true }: IAppBarProps) {
	return (
		<header className={cn("appbar", !showNav && "appbar--bare")}>
			<span className="wordmark">
				Stacks<span className="dot">.</span>
			</span>
			<label className="search">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="7" />
					<path d="M21 21l-4-4" />
				</svg>
				<input
					type="search"
					placeholder="Search title, author, or call number"
					aria-label="Search the catalogue"
				/>
			</label>
			{showNav && (
				<nav>
					<span className="on">Catalog</span>
					<span>Borrowed</span>
					<span>Chat</span>
				</nav>
			)}
			<AuthMenu />
		</header>
	)
}
