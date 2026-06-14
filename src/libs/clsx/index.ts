import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Conditional class composition: clsx for truthiness, tailwind-merge to resolve
// conflicting Tailwind utilities. The only class helper in the app.
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}
