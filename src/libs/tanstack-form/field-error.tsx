import type { AnyFieldApi } from "@tanstack/react-form"

interface IFieldErrorProps {
	field: AnyFieldApi
}

function firstMessage(errors: unknown[]): string {
	const first = errors[0]
	if (typeof first === "string") return first
	if (first && typeof first === "object" && "message" in first) {
		const { message } = first as { message?: unknown }
		if (typeof message === "string") return message
	}
	return "Invalid value"
}

// The single authoritative field error (skill §8): shown only once the field is
// touched or dirty, reserves vertical space to avoid layout shift, and is exposed
// to assistive tech as an alert only when visible.
export function FieldError({ field }: IFieldErrorProps) {
	const { isTouched, isDirty, errors } = field.state.meta
	const visible = (isTouched || isDirty) && errors.length > 0
	return (
		<p className="field-error" role={visible ? "alert" : undefined}>
			{visible ? firstMessage(errors) : " "}
		</p>
	)
}
