// Carries the HTTP status (and contract error code) of a failed request so
// callers can branch on it — notably 404 vs. a generic failure. `_apis/` wrappers
// throw this; hooks/components read `status`.
export class ApiError extends Error {
	readonly status: number
	readonly code?: string

	constructor(message: string, status: number, code?: string) {
		super(message)
		this.name = "ApiError"
		this.status = status
		this.code = code
	}
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError
}

// Normalises an unknown error (thrown value, fetch error body, string) into a
// human-readable message. Feature `_apis/` wrappers throw with this so hooks can
// surface a consistent message via toast / field errors.
export function extractErrorMessage(error: unknown): string {
	if (typeof error === "string") return error
	if (error instanceof Error) return error.message
	if (error && typeof error === "object" && "message" in error) {
		const { message } = error as { message: unknown }
		if (typeof message === "string") return message
	}
	return "An unexpected error occurred"
}
