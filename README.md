# library-web

TanStack SPA frontend for the Library project. **v0.3.0 — IAM: auth, roles, permissions (login/register/session; admin role UI + auth-screen design deferred).**

Single-tenant (ADR-0004). The only type bridge to the backend is the OpenAPI
contract at `../library-backend/contract/openapi.yaml`, consumed via
`openapi-typescript`.

## What's built

The M0 toolchain skeleton, the **catalog list** (T-001), the **book detail +
shelf/row finder** (T-002), and **IAM auth** (T-003) against the contract:

- Vite + TanStack Router (file-based) SPA, React 19
- `/` redirects to `/catalog`, which lists books in a card grid (design:
  `docs/designs/catalog.html`) with **loading, empty, error, and loaded** states
- `/books/$id` book detail (design: `docs/designs/catalog-detail.html`) with
  **loading, loaded, not-found (404), and error** states; cards link list → detail
- **Book-finder**: `shelf` + `row` filters held in the URL search params and passed
  to `GET /books`. The finder UI is intentionally minimal — `catalog.html` ships no
  finder design, so this is a placeholder **pending a design pass**.
- **IAM auth**: `/auth/login` + `/auth/register` (TanStack Form + Zod), logout, and a
  live session (`GET /auth/me`) surfaced in the app bar. A guarded `/account` route
  (`_authenticated` layout) demonstrates the route guard; **the catalogue stays
  public**. The bearer token is attached to every request via openapi-fetch
  middleware. **The auth screens are a clean default and need a design pass** (no
  `docs/designs/login.html` exists).
- Real types generated from the contract (`pnpm gen:api` → `src/libs/api/schema.d.ts`);
  `useListBooks` / `useBook` / `useLogin` / `useRegister` / `useSession` (TanStack
  Query + Store + Form) over a typed `openapi-fetch` client, no React hooks
- Test stack: Vitest + Testing Library + MSW (every state, finder filtering, the auth
  flow), Playwright E2E (list → detail; register → guarded account → logout → login)
- Biome (tabs, double quotes, semicolons as-needed) with the no-React-hooks lint gate
- Lefthook pre-commit + pre-push hooks (full gate: biome, tsc, contract-drift, vitest, e2e)

> **Token storage:** the JWT is kept in `localStorage` so the session survives reload
> (acceptable for this SPA, but XSS-exposed). Planned hardening: an httpOnly,
> SameSite cookie issued by the backend.
>
> **Deferred:** admin role assignment (`POST /users/{id}/roles`) is M4 (admin/RBAC)
> per the plan, not this 0.3.0 IAM release — deferred, not built.
>
> **Presentational, not yet wired:** the detail Borrow/Reserve actions, the appbar
> search, and the list filter chips render for design fidelity but have no contract
> backing yet (lending is M2; search/category filters aren't in the contract).

## Stack

| Layer | Tech |
| --- | --- |
| Framework | React 19 + TanStack Router + Vite |
| Server state | TanStack Query over `openapi-fetch` |
| Types | `openapi-typescript` from the backend OpenAPI contract |
| Styling | Tailwind v4 |
| Lint/format | Biome |
| Test | Vitest + Testing Library + Playwright + MSW |
| Hooks | Lefthook |

## Run

```bash
pnpm install
pnpm exec lefthook install   # register git hooks (once)
pnpm dev                     # http://localhost:5173 — serves the catalog
pnpm build                   # generate routes, typecheck, build
```

The dev server proxies `/api` → the gateway at `http://localhost:8080` (stripping
the prefix), so run the backend gateway alongside `pnpm dev` for live data.

## Test & checks

```bash
pnpm biome check .   # lint + format
pnpm tsc --noEmit    # typecheck
pnpm vitest run      # unit/component tests (MSW-mocked)
pnpm playwright test # E2E — auto-starts the gateway + Vite (needs: pnpm exec playwright install)
```

## Type generation

```bash
pnpm gen:api   # openapi-typescript -> src/libs/api/schema.d.ts
```

`schema.d.ts` and `src/routeTree.gen.ts` are generated — never hand-edit them.
`pnpm gen:api` reads `../library-backend/contract/openapi.yaml`; the pre-push
`contract-drift` hook fails if the committed `schema.d.ts` drifts from the contract.

## Conventions

- **No React hooks** — TanStack primitives only (enforced by Biome + the
  `no-react-hooks` rule).
- Conventional Commits; lefthook is the gatekeeper — never `--no-verify`.
- Files/folders are kebab-case; types prefixed `T`, interfaces `I`, enums `E`.
