// The design draws each cover as a flat colour block (no cover images in the
// contract). Pick a stable colour from the design palette by hashing the book id,
// so a given book always renders the same cover — presentation only, no data
// invented.
const COVER_PALETTE = ["#2C5949", "#6B3B52", "#3A4A6B", "#1F4034", "#8A6730", "#714B3A"] as const

export function coverColor(seed: string): string {
	let hash = 0
	for (let i = 0; i < seed.length; i++) {
		hash = (hash * 31 + seed.charCodeAt(i)) | 0
	}
	const index = Math.abs(hash) % COVER_PALETTE.length
	return COVER_PALETTE[index]
}
