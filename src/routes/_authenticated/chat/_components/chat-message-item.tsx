import { cn } from "#/libs/clsx/index.ts"
import type { TChatMessage } from "#/routes/_authenticated/chat/_apis/index.ts"

interface IChatMessageItemProps {
	message: TChatMessage
	mine: boolean
}

const timeOf = (iso: string) => iso.slice(11, 16)
const shortId = (id: string) => id.slice(0, 8)

// One chat message bubble. Own messages align right and read "You".
export function ChatMessageItem({ message, mine }: IChatMessageItemProps) {
	return (
		<li className={cn("chat-msg", mine && "chat-msg--mine")}>
			<div className="chat-bubble">
				<div className="chat-author">{mine ? "You" : shortId(message.user_id)}</div>
				<div className="chat-body">{message.body}</div>
				<time className="chat-time">{timeOf(message.created_at)}</time>
			</div>
		</li>
	)
}
