import { act, fireEvent, screen, waitFor, within } from "@testing-library/react"
import { delay, HttpResponse, http } from "msw"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { setToken } from "#/libs/auth/token-store.ts"
import { disconnectChat } from "#/libs/chat/chat-socket.ts"
import { server } from "./mocks/server.ts"
import { MockWebSocket } from "./mocks/websocket.ts"
import { renderRoute } from "./utils.tsx"

const ROOM = "ask-a-librarian"
const HISTORY_URL = "*/api/chat/rooms/:room/messages"
const ME_URL = "*/api/auth/me"
const ME_ID = "11111111-1111-4111-8111-111111111111"
const me = { id: ME_ID, email: "me@example.com", role: "member" } as const

let seq = 0
function makeMessage(over: { body: string; user_id?: string }) {
	seq += 1
	return {
		id: `00000000-0000-4000-a000-${String(seq).padStart(12, "0")}`,
		room: ROOM,
		user_id: over.user_id ?? "99999999-9999-4999-8999-999999999999",
		body: over.body,
		created_at: "2026-06-14T20:14:53Z",
	}
}

function makeHistory(messages: ReturnType<typeof makeMessage>[]) {
	return {
		data: messages,
		pagination: { page: 1, page_size: 50, total: messages.length, total_pages: 1 },
	}
}

beforeEach(() => {
	vi.stubGlobal("WebSocket", MockWebSocket)
	MockWebSocket.reset()
	setToken("jwt")
	server.use(http.get(ME_URL, () => HttpResponse.json(me)))
})

afterEach(() => {
	disconnectChat()
	vi.unstubAllGlobals()
})

describe("chat room", () => {
	it("renders history, connects, sends, and receives live messages", async () => {
		server.use(
			http.get(HISTORY_URL, () =>
				HttpResponse.json(makeHistory([makeMessage({ body: "old message" })])),
			),
		)

		renderRoute(`/chat/${ROOM}`)

		// history rendered
		expect(await screen.findByText("old message")).toBeInTheDocument()

		// the loader opened a socket to the right room with the token
		const socket = MockWebSocket.last()
		expect(socket.url).toContain("/api/ws/chat?room=ask-a-librarian")
		expect(socket.url).toContain("token=jwt")

		// open the socket → composer enabled
		act(() => socket.open())
		const input = screen.getByLabelText("Message")
		expect(input).toBeEnabled()

		// an incoming broadcast from another user renders
		act(() => socket.emit(makeMessage({ body: "hello from staff" })))
		expect(await screen.findByText("hello from staff")).toBeInTheDocument()

		// sending a message frames a ChatSend; the echoed broadcast renders as mine
		fireEvent.change(input, { target: { value: "hi there" } })
		fireEvent.click(screen.getByRole("button", { name: "Send" }))
		await waitFor(() => expect(socket.sent).toContain(JSON.stringify({ body: "hi there" })))

		act(() => socket.emit(makeMessage({ body: "hi there", user_id: ME_ID })))
		const mine = await screen.findByText("hi there")
		expect(mine.closest(".chat-msg")).toHaveClass("chat-msg--mine")
		expect(within(mine.closest(".chat-msg") as HTMLElement).getByText("You")).toBeInTheDocument()
	})

	it("renders the empty state when there is no history", async () => {
		server.use(http.get(HISTORY_URL, () => HttpResponse.json(makeHistory([]))))

		renderRoute(`/chat/${ROOM}`)

		expect(await screen.findByText(/no messages yet/i)).toBeInTheDocument()
	})

	it("renders the loading state while history loads", async () => {
		server.use(
			http.get(HISTORY_URL, async () => {
				await delay(150)
				return HttpResponse.json(makeHistory([]))
			}),
		)

		renderRoute(`/chat/${ROOM}`)

		expect(await screen.findByRole("status", { name: /loading messages/i })).toBeInTheDocument()
	})

	it("renders an error when history fails", async () => {
		server.use(http.get(HISTORY_URL, () => new HttpResponse(null, { status: 500 })))

		renderRoute(`/chat/${ROOM}`)

		expect(await screen.findByRole("alert")).toHaveTextContent(/couldn’t load messages/i)
	})

	it("redirects to login when not authenticated", async () => {
		disconnectChat()
		// clear the token set in beforeEach
		const { clearToken } = await import("#/libs/auth/token-store.ts")
		clearToken()

		renderRoute(`/chat/${ROOM}`)

		expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument()
	})
})
