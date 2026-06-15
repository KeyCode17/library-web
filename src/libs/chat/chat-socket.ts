import { Store } from "@tanstack/store"
import type { TChatMessage, TChatSend } from "#/libs/api/chat.ts"

// Chat WebSocket lifecycle kept OUTSIDE React (no-react-hooks rule): a plain
// service over a TanStack Store. Components subscribe to the store via `useStore`;
// the connection is opened/closed from route loaders, never a component effect.
export type TChatStatus = "idle" | "connecting" | "open" | "closed" | "error"

interface IChatSocketState {
	room: string | null
	status: TChatStatus
	messages: TChatMessage[]
}

export const chatSocketStore = new Store<IChatSocketState>({
	room: null,
	status: "idle",
	messages: [],
})

let socket: WebSocket | null = null

function buildUrl(room: string): string {
	// The gateway authenticates the upgrade via the httpOnly `session` cookie, which
	// the browser sends automatically on this same-origin WS handshake (no JS token).
	// Vite proxies /api/ws → the gateway.
	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
	return `${protocol}//${window.location.host}/api/ws/chat?room=${encodeURIComponent(room)}`
}

export function connectChat(room: string): void {
	const { room: current, status } = chatSocketStore.state
	if (socket && current === room && (status === "connecting" || status === "open")) {
		return
	}
	disconnectChat()
	chatSocketStore.setState(() => ({ room, status: "connecting", messages: [] }))

	const ws = new WebSocket(buildUrl(room))
	socket = ws
	ws.onopen = () => chatSocketStore.setState((state) => ({ ...state, status: "open" }))
	ws.onmessage = (event) => {
		try {
			const message = JSON.parse(String(event.data)) as TChatMessage
			chatSocketStore.setState((state) => ({ ...state, messages: [...state.messages, message] }))
		} catch {
			// ignore non-JSON frames
		}
	}
	ws.onerror = () => chatSocketStore.setState((state) => ({ ...state, status: "error" }))
	ws.onclose = () =>
		chatSocketStore.setState((state) =>
			state.status === "error" ? state : { ...state, status: "closed" },
		)
}

export function disconnectChat(): void {
	if (socket) {
		socket.onopen = null
		socket.onmessage = null
		socket.onerror = null
		socket.onclose = null
		try {
			socket.close()
		} catch {
			// already closing/closed
		}
		socket = null
	}
	chatSocketStore.setState(() => ({ room: null, status: "idle", messages: [] }))
}

export function sendChat(body: string): boolean {
	if (socket && socket.readyState === WebSocket.OPEN) {
		const payload: TChatSend = { body }
		socket.send(JSON.stringify(payload))
		return true
	}
	return false
}
