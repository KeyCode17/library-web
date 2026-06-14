import { useMutation } from "@tanstack/react-query"
import { recommend, type TRecommendRequest } from "#/routes/recommend/_apis/index.ts"

// `POST /recommend` as a mutation — the user submits preferences on demand, so the
// idle/pending/error/success states drive the results view.
export function useRecommend() {
	return useMutation({
		mutationKey: ["recommend"],
		mutationFn: (request: TRecommendRequest) => recommend(request),
	})
}
