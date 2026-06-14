import { useQuery } from "@tanstack/react-query"
import { chatHistory, chatKeys } from "#/libs/api/chat.ts"

// `GET /chat/rooms/{room}/messages` — the room's past messages (oldest first).
// Live messages arrive separately over the socket store.
export function useChatHistory(room: string) {
	return useQuery({
		queryKey: chatKeys.history(room),
		queryFn: () => chatHistory(room),
		retry: false,
	})
}
