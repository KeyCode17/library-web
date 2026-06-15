import { createFileRoute } from "@tanstack/react-router"
import { connectChat } from "#/libs/chat/chat-socket.ts"
import { ChatRoom } from "./_components/chat-room.tsx"

export const Route = createFileRoute("/_authenticated/chat/$room")({
	// Open the socket on real navigation (not hover-preload). The lifecycle lives
	// in the service, not a component effect (no-react-hooks rule). Auth rides the
	// session cookie on the WS handshake — no token needed.
	loader: ({ params, preload }) => {
		if (!preload) connectChat(params.room)
	},
	component: ChatRoomRoute,
})

function ChatRoomRoute() {
	const { room } = Route.useParams()
	return <ChatRoom room={room} />
}
