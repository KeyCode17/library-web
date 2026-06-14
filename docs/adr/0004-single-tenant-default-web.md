# ADR — Single-tenant by default

| | |
|---|---|
| Status | Accepted |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## Context
The reference frontend skills ask multi- vs single-tenant up front.

## Decision
Scaffold single-tenant (one library): no `$orgSlug` route layer, one role axis. Adding
tenancy later is a defined migration.

## Consequences
- Simpler routing/auth now; no dead org apparatus.
