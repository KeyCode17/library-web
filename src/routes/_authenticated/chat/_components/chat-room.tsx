import { Link } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { match } from "ts-pattern"
import { PageShell } from "#/components/layout/page-shell.tsx"
import { useSession } from "#/libs/auth/use-session.ts"
import { chatSocketStore, sendChat, type TChatStatus } from "#/libs/chat/chat-socket.ts"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { useChatHistory } from "#/routes/_authenticated/chat/_hooks/use-chat-history.ts"
import { ChatComposer } from "./chat-composer.tsx"
import { ChatMessageItem } from "./chat-message-item.tsx"

const roomLabel = (room: string) => (room === "ask-a-librarian" ? "Ask a librarian" : room)

const STATUS_LABEL: Record<TChatStatus, string> = {
	idle: "Not connected",
	connecting: "Connecting…",
	open: "Live",
	closed: "Disconnected",
	error: "Connection error",
}

interface IChatRoomProps {
	room: string
}

// A chat room: REST history + live socket messages + a composer. The socket is
// opened by the route loader (lifecycle outside React); this only subscribes.
export function ChatRoom({ room }: IChatRoomProps) {
	const history = useChatHistory(room)
	const socket = useStore(chatSocketStore)
	const session = useSession()
	const myId = session.data?.id
	const live = socket.room === room ? socket.messages : []

	return (
		<PageShell>
			<section className="chat-head">
				<div>
					<h1>{roomLabel(room)}</h1>
					<p className="chat-status" data-status={socket.status}>
						{STATUS_LABEL[socket.status]}
					</p>
				</div>
				<Link to="/chat" className="btn">
					Leave
				</Link>
			</section>
			{match(history)
				.with({ status: "pending" }, () => (
					<p className="state-body" role="status" aria-label="Loading messages">
						Loading messages…
					</p>
				))
				.with({ status: "error" }, ({ error }) => (
					<div className="state-panel" role="alert">
						<h2 className="state-title">Couldn’t load messages</h2>
						<p className="state-body">{extractErrorMessage(error)}</p>
					</div>
				))
				.with({ status: "success" }, ({ data }) => {
					const messages = [...data.data, ...live]
					return (
						<div className="chat">
							{messages.length === 0 ? (
								<div className="state-panel">
									<h2 className="state-title">No messages yet</h2>
									<p className="state-body">Be the first to say hello.</p>
								</div>
							) : (
								<ul className="chat-log">
									{messages.map((message) => (
										<ChatMessageItem
											key={message.id}
											message={message}
											mine={message.user_id === myId}
										/>
									))}
								</ul>
							)}
							<ChatComposer disabled={socket.status !== "open"} onSend={(body) => sendChat(body)} />
						</div>
					)
				})
				.exhaustive()}
		</PageShell>
	)
}
