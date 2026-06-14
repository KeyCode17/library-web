import { useForm } from "@tanstack/react-form"

interface IChatComposerProps {
	disabled: boolean
	onSend: (body: string) => void
}

// Message composer (single-field TanStack Form; no React hooks). Clears on send.
export function ChatComposer({ disabled, onSend }: IChatComposerProps) {
	const form = useForm({
		defaultValues: { body: "" },
		onSubmit: ({ value }) => {
			const body = value.body.trim()
			if (!body) return
			onSend(body)
			form.reset()
		},
	})

	return (
		<form
			className="chat-composer"
			onSubmit={(event) => {
				event.preventDefault()
				event.stopPropagation()
				form.handleSubmit()
			}}
		>
			<form.Field name="body">
				{(field) => (
					<input
						className="chat-input"
						type="text"
						aria-label="Message"
						placeholder="Type a message…"
						value={field.state.value}
						onChange={(event) => field.handleChange(event.target.value)}
						disabled={disabled}
					/>
				)}
			</form.Field>
			<button type="submit" className="btn primary" disabled={disabled}>
				Send
			</button>
		</form>
	)
}
