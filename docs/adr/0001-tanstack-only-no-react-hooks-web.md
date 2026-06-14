# ADR — TanStack-only, no React hooks

| | |
|---|---|
| Status | Accepted |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## Context
Team was burned by ad-hoc React custom hooks; prefers TanStack's disciplined primitives.

## Decision
Ban every React hook. State/effects/derived/refs/context come from TanStack only (Query,
Router, Form, Store, Table, Virtual). Enforced by Biome `noRestrictedImports` on the `react`
hook surface + PR review. See the "No React Hooks Rule" doc.

## Consequences
- One state model; no `useState`-vs-Query fragmentation.
- New behaviour with no TanStack primitive → stop and ask, don't reach for React.
