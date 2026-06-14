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
