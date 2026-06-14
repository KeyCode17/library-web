# PRD — Web SPA

| | |
|---|---|
| Status | Draft |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## 1. Users
Librarians/admins on desktop; members browsing the catalog.

## 2. Capabilities
- Browse/search catalog; see shelf location.
- Manage lending (approve, return) — staff.
- View recommendations (server-computed via `/recommend`).
- Admin: members, roles (RBAC affordances are cosmetic; server enforces).

## 3. Non-functional
- Always online (calls the backend) — no offline requirement.
- Type-safe against the contract; zero hand-written API types.

## 4. Success metrics
- Route-level data ready before render (Suspense + loaders) on key pages.
- Lighthouse perf budget met (manual vendor chunking).
