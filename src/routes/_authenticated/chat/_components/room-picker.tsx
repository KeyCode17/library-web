import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { PageShell } from "#/components/layout/page-shell.tsx"
import { bookKeys, listBooks } from "#/libs/api/books.ts"

interface IRoom {
	key: string
	label: string
	desc: string
}

// Room selection: the ask-a-librarian room plus a room per book category (shelf),
// per the contract ("an event id, a book category, or ask-a-librarian").
export function RoomPicker() {
	const booksQuery = useQuery({
		queryKey: bookKeys.list({ page_size: 100 }),
		queryFn: () => listBooks({ page_size: 100 }),
	})
	const shelves = Array.from(
		new Set((booksQuery.data?.data ?? []).map((book) => book.shelf)),
	).sort()

	const rooms: IRoom[] = [
		{ key: "ask-a-librarian", label: "Ask a librarian", desc: "Questions for the library staff." },
		...shelves.map((shelf) => ({
			key: shelf,
			label: `${shelf} readers`,
			desc: `Chat about ${shelf} books.`,
		})),
	]

	return (
		<PageShell>
			<section className="head">
				<h1>Chat rooms</h1>
				<p>Join a group conversation.</p>
			</section>
			<ul className="room-list">
				{rooms.map((room) => (
					<li key={room.key}>
						{/* preload disabled: the $room loader opens the socket on enter, not on hover */}
						<Link
							to="/chat/$room"
							params={{ room: room.key }}
							preload={false}
							className="room-card"
						>
							<span className="room-name">{room.label}</span>
							<span className="room-desc">{room.desc}</span>
						</Link>
					</li>
				))}
			</ul>
		</PageShell>
	)
}
