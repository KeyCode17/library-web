import { cn } from "#/libs/clsx/index.ts"

interface IAvailabilityBadgeProps {
	available: boolean
}

// Availability pill (design `.avail.in` / `.avail.out`).
export function AvailabilityBadge({ available }: IAvailabilityBadgeProps) {
	return (
		<span className={cn("avail", available ? "in" : "out")}>
			<span className="d" />
			{available ? "Available" : "Borrowed"}
		</span>
	)
}
