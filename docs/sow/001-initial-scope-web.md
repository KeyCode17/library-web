# SOW — Web SPA Initial Scope

| | |
|---|---|
| Status | Draft |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## 1. Objective
Browser client for the library platform: catalog, lending management, recommendations, and
admin views, built as a TanStack SPA.

## 2. In scope
- TanStack Router SPA (file-based), TanStack Query/Form/Store/Table.
- REST integration via `openapi-fetch`, types from the OpenAPI contract.
- Recommendations via the backend `/recommend` endpoint (no browser WASM).

## 3. Out of scope
- Any Rust/WASM in the browser (ADR-0002, backend ADR-0003).
- Business logic / authoritative auth (server-side).
- React hooks of any kind (ADR-0001).

## 4. Deliverables
- SPA with the feature set, typed end-to-end against the contract.
- Committed generated `schema.d.ts`, CI drift gate.

## 5. Acceptance
- `pnpm gen:api` reproduces `schema.d.ts` with no diff.
- No `react` hook imports anywhere (lint-enforced).
