# ADR — Types from the OpenAPI contract

| | |
|---|---|
| Status | Accepted |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## Context
Backend is Rust — no end-to-end TS types like an oRPC/TS backend would give.

## Decision
Generate `paths` types with `openapi-typescript` from `library-backend/contract/openapi.yaml`;
call endpoints via `openapi-fetch`. Commit the generated `schema.d.ts`.

## Consequences
- The OpenAPI contract is the only front/back type bridge.
- CI fails on drift; never hand-edit `schema.d.ts`.
