// Minimal fake WebSocket for component tests: records sent frames and lets the
// test drive open/message/close. Install via `globalThis.WebSocket = MockWebSocket`.
export class MockWebSocket {
	static readonly CONNECTING = 0
	static readonly OPEN = 1
	static readonly CLOSING = 2
	static readonly CLOSED = 3
	static instances: MockWebSocket[] = []

	url: string
	readyState = MockWebSocket.CONNECTING
	sent: string[] = []
	onopen: (() => void) | null = null
	onmessage: ((event: { data: string }) => void) | null = null
	onerror: (() => void) | null = null
	onclose: (() => void) | null = null

	constructor(url: string) {
		this.url = url
		MockWebSocket.instances.push(this)
	}

	send(data: string): void {
		this.sent.push(data)
	}

	close(): void {
		this.readyState = MockWebSocket.CLOSED
		this.onclose?.()
	}

	// --- test drivers ---
	open(): void {
		this.readyState = MockWebSocket.OPEN
		this.onopen?.()
	}

	emit(message: unknown): void {
		this.onmessage?.({ data: JSON.stringify(message) })
	}

	static reset(): void {
		MockWebSocket.instances = []
	}

	static last(): MockWebSocket {
		const socket = MockWebSocket.instances.at(-1)
		if (!socket) throw new Error("no MockWebSocket was created")
		return socket
	}
}
