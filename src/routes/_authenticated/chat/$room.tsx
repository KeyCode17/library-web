import { createFileRoute } from "@tanstack/react-router"
import { getToken } from "#/libs/auth/token-store.ts"
import { connectChat } from "#/libs/chat/chat-socket.ts"
import { ChatRoom } from "./_components/chat-room.tsx"

export const Route = createFileRoute("/_authenticated/chat/$room")({
	// Open the socket on real navigation (not hover-preload). The lifecycle lives
	// in the service, not a component effect (no-react-hooks rule).
	loader: ({ params, preload }) => {
		if (!preload) connectChat(params.room, getToken() ?? "")
	},
	component: ChatRoomRoute,
})

function ChatRoomRoute() {
	const { room } = Route.useParams()
	return <ChatRoom room={room} />
}
