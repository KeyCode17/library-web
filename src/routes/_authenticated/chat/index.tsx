import { createFileRoute } from "@tanstack/react-router"
import { disconnectChat } from "#/libs/chat/chat-socket.ts"
import { RoomPicker } from "./_components/room-picker.tsx"

export const Route = createFileRoute("/_authenticated/chat/")({
	// Entering the picker means leaving any room — close the socket. Skip on
	// preload (hover) so we don't disconnect a live room from a hover.
	loader: ({ preload }) => {
		if (!preload) disconnectChat()
	},
	component: RoomPicker,
})
