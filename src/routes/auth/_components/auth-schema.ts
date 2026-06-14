import { z } from "zod"

// Mirrors the contract `Credentials` shape (email + password, min length 8).
// Used by both the login and register forms.
export const credentialsSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
})

export type TCredentialsForm = z.infer<typeof credentialsSchema>
