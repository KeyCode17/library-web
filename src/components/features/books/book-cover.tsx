interface IBookCoverProps {
	title: string
	author: string
	color: string
}

// CSS-drawn cover (design `.cover`): a colour block with the title/author set in
// the display face over a darkened spine edge.
export function BookCover({ title, author, color }: IBookCoverProps) {
	return (
		<div className="cover" style={{ background: color }}>
			<div className="ct">{title}</div>
			<div className="ca">{author}</div>
		</div>
	)
}
