# PLAN — Web Implementation

| | |
|---|---|
| Status | Draft |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## Milestones
1. **M0 — Shell.** Vite + TanStack Router, QueryClient, auth/public layouts, `openapi-fetch`
   client, `gen:api` wired to the contract.
2. **M1 — Catalog.** List/detail over the contract.
3. **M2 — Lending admin.** Approve/return flows.
4. **M3 — Recommendations.** `/recommend` query + UI.
5. **M4 — Admin/RBAC.** Members/roles, cosmetic gating.

## Dependencies
- Every feature blocked on its contract endpoints existing in `library-backend`.
- `schema.d.ts` regenerated whenever the contract changes.
