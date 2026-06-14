interface IMapPinIconProps {
	size?: number
}

// The map-pin glyph used by the shelf tab and the detail shelf block.
export function MapPinIcon({ size = 11 }: IMapPinIconProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
		</svg>
	)
}
