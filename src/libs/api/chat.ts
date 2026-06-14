import type { components, operations } from "#/libs/api/schema"
import { ApiError, extractErrorMessage } from "#/libs/errors/index.ts"
import { api } from "./client.ts"

export type TChatMessage = components["schemas"]["ChatMessage"]
export type TChatSend = components["schemas"]["ChatSend"]
export type TChatMessageList = components["schemas"]["ChatMessageList"]
export type TChatHistoryParams = NonNullable<operations["chatHistory"]["parameters"]["query"]>
type TApiError = components["schemas"]["Error"]

// `GET /chat/rooms/{room}/messages` — paginated history (oldest first), bearerAuth.
export async function chatHistory(
	room: string,
	params?: TChatHistoryParams,
): Promise<TChatMessageList> {
	const { data, error, response } = await api.GET("/chat/rooms/{room}/messages", {
		params: { path: { room }, query: params },
	})
	if (error || !data) {
		const body = error as TApiError | undefined
		throw new ApiError(
			body?.message ?? extractErrorMessage(error),
			response?.status ?? 0,
			body?.code,
		)
	}
	return data
}

export const chatKeys = {
	all: ["chat"] as const,
	room: (room: string) => [...chatKeys.all, "room", room] as const,
	history: (room: string, params?: TChatHistoryParams) =>
		[...chatKeys.room(room), "history", params ?? {}] as const,
}
