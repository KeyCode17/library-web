import type { components } from "#/libs/api/schema"
import { extractErrorMessage } from "#/libs/errors/index.ts"
import { api } from "./client.ts"

export type TPreferences = components["schemas"]["Preferences"]
export type TRecommendRequest = components["schemas"]["RecommendRequest"]
export type TRecommendResponse = components["schemas"]["RecommendResponse"]

// `POST /recommend` — public. Ranks the server catalogue (or the supplied
// candidates) against the given preferences, returning book ids best-match first.
// The contract defines only a 200; any failure here is a network/unexpected error.
export async function recommend(request: TRecommendRequest): Promise<TRecommendResponse> {
	const { data, error } = await api.POST("/recommend", { body: request })
	if (error || !data) throw new Error(extractErrorMessage(error))
	return data
}
