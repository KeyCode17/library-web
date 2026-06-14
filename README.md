# library-web

TanStack SPA frontend for the Library project. **Version 0.1.0 — M0 skeleton.**

Single-tenant (ADR-0004). The only type bridge to the backend is the OpenAPI
contract at `../library-backend/contract/openapi.yaml`, consumed via
`openapi-typescript`.

## What's built (M0)

A booting skeleton with the full toolchain and gate wired — **no feature code yet**
(the catalog screen is T-001w, after the backend contract lands):

- Vite + TanStack Router (file-based) SPA, React 19
- TanStack Query `QueryClient` singleton + `openapi-fetch` client
- `gen:api` script (openapi-typescript → `src/libs/api/schema.d.ts`) — wired but
  not yet runnable; `schema.d.ts` is a committed placeholder until the contract exists
- Test stack: Vitest + Testing Library (component), Playwright (E2E), MSW (mocks)
- Biome (tabs, double quotes, semicolons as-needed) with the no-React-hooks lint gate
- Lefthook pre-commit + pre-push hooks

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
pnpm dev                     # http://localhost:5173 — serves the landing shell
pnpm build                   # generate routes, typecheck, build
```

## Test & checks

```bash
pnpm biome check .   # lint + format
pnpm tsc --noEmit    # typecheck
pnpm vitest run      # unit/component tests
pnpm playwright test # E2E (needs browsers: pnpm exec playwright install)
```

## Type generation

```bash
pnpm gen:api   # openapi-typescript -> src/libs/api/schema.d.ts
```

`schema.d.ts` and `src/routeTree.gen.ts` are generated — never hand-edit them.
At M0 the contract does not exist yet, so `gen:api` cannot run for real; it
activates in T-001w. The pre-push `contract-drift` and `e2e` hooks depend on the
contract and a running backend and likewise activate then.

## Conventions

- **No React hooks** — TanStack primitives only (enforced by Biome + the
  `no-react-hooks` rule).
- Conventional Commits; lefthook is the gatekeeper — never `--no-verify`.
- Files/folders are kebab-case; types prefixed `T`, interfaces `I`, enums `E`.
