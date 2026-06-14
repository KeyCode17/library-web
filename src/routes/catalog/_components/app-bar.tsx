// Sticky application bar (design `.appbar`): wordmark, search, nav, avatar.
//
// Search and the secondary nav items (Borrowed, Chat) are presentational for
// T-001 — the contract exposes neither search nor those screens yet, so they are
// rendered for design fidelity without faking behaviour.
export function AppBar() {
	return (
		<header className="appbar">
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
			<nav>
				<span className="on">Catalog</span>
				<span>Borrowed</span>
				<span>Chat</span>
			</nav>
			<div className="avatar">DK</div>
		</header>
	)
}
