# library-web

TanStack SPA frontend for the Library project. **Version 0.1.0 — catalog list (T-001).**

Single-tenant (ADR-0004). The only type bridge to the backend is the OpenAPI
contract at `../library-backend/contract/openapi.yaml`, consumed via
`openapi-typescript`.

## What's built

The M0 toolchain skeleton, plus the **catalog list screen** (T-001) against the
`GET /books` contract:

- Vite + TanStack Router (file-based) SPA, React 19
- `/` redirects to `/catalog`, which lists books in a card grid (design:
  `docs/designs/catalog.html`) with **loading, empty, error, and loaded** states
- Real types generated from the contract (`pnpm gen:api` → `src/libs/api/schema.d.ts`);
  `useListBooks` (TanStack Query) over a typed `openapi-fetch` client, no React hooks
- Test stack: Vitest + Testing Library + MSW (the four states), Playwright E2E
  against the running gateway
- Biome (tabs, double quotes, semicolons as-needed) with the no-React-hooks lint gate
- Lefthook pre-commit + pre-push hooks (full gate: biome, tsc, contract-drift, vitest, e2e)

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
