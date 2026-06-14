# FSD — Web Behaviour

| | |
|---|---|
| Status | Draft |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## 1. Architecture
TanStack SPA. Server state = TanStack Query (over `openapi-fetch`); client state = TanStack
Store; forms = TanStack Form + Zod. No React hooks (see ADR-0001 and the No-React-Hooks
rule).

## 2. Types
`openapi-typescript` reads `library-backend/contract/openapi.yaml` (sibling repo path) →
`src/libs/api/schema.d.ts` (committed). Regenerate via `pnpm gen:api`.

## 3. Feature slices
Each route folder colocates `_apis/` (typed fetch wrappers + query-key factory), `_hooks/`
(one hook per endpoint, `use-{verb}-{noun}.ts`), `_components/` (Zod schema, tables, forms).

## 4. Routing
File-based; `_authenticated` / `_public` layout pairs; session resolved once in `__root`
`beforeLoad`; role gates in `beforeLoad` (UX only — authoritative on the server).

## 5. Recommendations
`useQuery` against `/recommend`. The decision tree runs server-side; the web never executes
recommendation logic locally.
