import { Link, useNavigate } from "@tanstack/react-router"
import { cn } from "#/libs/clsx/index.ts"
import { AuthMenu } from "./auth-menu.tsx"

interface IAppBarProps {
	// The detail design omits the nav; the list shows it.
	showNav?: boolean
}

// Application bar (design `.appbar`): wordmark, search, optional nav, auth menu.
// The search submits to the catalogue (`GET /books?q=`); the auth menu reflects
// the live cookie session. The secondary nav item "Borrowed" stays presentational.
export function AppBar({ showNav = true }: IAppBarProps) {
	const navigate = useNavigate()
	return (
		<header className={cn("appbar", !showNav && "appbar--bare")}>
			<span className="wordmark">
				Stacks<span className="dot">.</span>
			</span>
			<search aria-label="Catalogue search">
				<form
					className="search"
					onSubmit={(event) => {
						event.preventDefault()
						const q = new FormData(event.currentTarget).get("q")
						navigate({
							to: "/catalog",
							search: { q: typeof q === "string" && q !== "" ? q : undefined },
						})
					}}
				>
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
						name="q"
						placeholder="Search title, author, or ISBN"
						aria-label="Search the catalogue"
					/>
				</form>
			</search>
			{showNav && (
				<nav>
					<span className="on">Catalog</span>
					<span>Borrowed</span>
					<Link to="/recommend" className="appbar-link">
						Recommend
					</Link>
				</nav>
			)}
			<AuthMenu />
		</header>
	)
}
