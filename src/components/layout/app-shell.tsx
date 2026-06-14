import { cn } from "#/libs/clsx/index.ts"

interface IAppShellProps {
	className?: string
}

// M0 placeholder landing shell. Feature screens (catalog list/detail) arrive in
// T-001w once the backend contract lands — this is the booting skeleton only.
export function AppShell({ className }: IAppShellProps) {
	return (
		<main
			className={cn(
				"flex min-h-dvh flex-col items-center justify-center gap-3 bg-neutral-50 p-8 text-center text-neutral-900",
				className,
			)}
		>
			<h1 className="text-4xl font-semibold tracking-tight">Library</h1>
			<p className="max-w-prose text-neutral-600">
				Frontend skeleton is up. Catalog and lending screens land once the API contract is
				published.
			</p>
		</main>
	)
}
