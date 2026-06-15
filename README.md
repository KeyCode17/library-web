# library-web

TanStack SPA frontend for the Library project. **v1.0.0 — ready to deploy/live.** Full feature set (catalog, auth, lending, recommendations, chat), a11y + perf hardened, contract-typed against the backend.

> **Deployment:** the SPA proxies `/api` to the backend gateway, which now requires
> `DATABASE_URL` (Postgres), `IAM_JWT_SECRET`, and FCM config to be set in real
> environments. For local E2E the Playwright `webServer` provisions a throwaway
> Postgres in Docker (see below).

Single-tenant (ADR-0004). The only type bridge to the backend is the OpenAPI
contract at `../library-backend/contract/openapi.yaml`, consumed via
`openapi-typescript`.

## What's built

The M0 toolchain skeleton, the **catalog list** (T-001), the **book detail +
shelf/row finder** (T-002), **IAM auth** (T-003), **lending** (T-004),
**recommendations** (T-005), and **group chat** (T-006) against the contract:

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
- **IAM v2** (T-012): an admin-gated **Manage Users** screen (`/admin/users`) — paginated
  list, create, assign role, edit email, deactivate/reactivate, delete (server enforces
  admin + last-admin/lockout, surfaced per row); **account self-service** on `/account` —
  change password, update email, delete account (two-step `<details>` confirm); a
  **forgot → reset** password flow (neutral confirmation, token from the email link) and
  an **email-verification** route plus an **unverified-email banner**. `/auth/me` exposes
  `verified`/`active`. **No design files for these — clean defaults, need a design pass.**
- **Lending**: a wired **Borrow** on the book detail (`POST /loans`; reflects the
  book going on loan; handles 401 → login prompt and 409 → already-on-loan). A guarded
  `/loans` view (`GET /loans`) lists loans with status + due date and a **Return**
  action; **role-aware** — `librarian`/`admin` see all loans and an **Approve** action,
  hidden for members (server enforces regardless). **No lending design exists — this is
  a clean default, needs a design pass.**
- **Recommendations**: a public `/recommend` view — express `Preferences` (shelf chips,
  authors, available-only) and `POST /recommend` over **REST** (the decision-tree runs
  server-side). The response is ranked **book ids**, resolved against the catalogue and
  rendered in rank order; states idle/loading/empty/error/loaded. **No recommend design
  exists — clean default, needs a design pass.** (Android consumes the same recommender
  via the on-device FFI binding instead — not the web's concern.)
- **Group chat** (guarded): a room picker (`/chat`) — ask-a-librarian + a room per book
  category — and a room view (`/chat/$room`) that loads REST history
  (`GET /chat/rooms/{room}/messages`) and opens a **WebSocket**
  (`/ws/chat?room=&token=<jwt>`) for live messages; send `ChatSend`, append incoming
  `ChatMessage` broadcasts, with a connection-status indicator. **The socket lifecycle is
  managed outside React** (a TanStack Store service connected/closed from route loaders,
  subscribed via `useStore`) — no `useEffect`/`useRef`. **No chat design exists — clean
  default, needs a design pass.**
- Real types generated from the contract (`pnpm gen:api` → `src/libs/api/schema.d.ts`);
  `useListBooks` / `useBook` / `useLogin` / `useRegister` / `useSession` / `useBorrowBook`
  / `useListLoans` / `useReturnLoan` / `useApproveLoan` / `useRecommend` / `useChatHistory`
  (TanStack Query + Store + Form) over a typed `openapi-fetch` client, no React hooks
- **Hardening (T-009)**: an accessibility pass across every screen — one `<main>`
  landmark per page (`PageShell`), labelled controls, a consistent visible focus ring,
  WCAG-AA colour contrast, sane heading order — with **automated axe assertions**
  (`vitest-axe` per screen + `@axe-core/playwright` on the real browser). Performance:
  route-level code-splitting (auto), manual vendor chunking, and tuned TanStack Query
  cache defaults (`staleTime`/`gcTime`, no refetch on focus/reconnect). The catalog
  `isbn` finder param is consumed (barcode-resolvable).
- Real types generated from the contract (`pnpm gen:api` → `src/libs/api/schema.d.ts`);
  `useListBooks` / `useBook` / `useLogin` / `useRegister` / `useSession` / `useBorrowBook`
  / `useListLoans` / `useReturnLoan` / `useApproveLoan` / `useRecommend` / `useChatHistory`
  (TanStack Query + Store + Form) over a typed `openapi-fetch` client, no React hooks
- Test stack: Vitest + Testing Library + MSW (every state, finder, auth, lending + role
  gating, ranked recommendations, chat over a **fake WebSocket**, axe a11y), Playwright
  E2E (list → detail; auth flow; borrow → my-loans → return; recommend; chat over a live
  WS; real-browser axe)
- Biome (tabs, double quotes, semicolons as-needed) with the no-React-hooks lint gate
- Lefthook pre-commit + pre-push hooks (full gate: biome, tsc, contract-drift, vitest, e2e)

> **Design fidelity:** the catalog and book-detail screens still match
> `docs/designs/*.html` in layout, typography, spacing, and tokens. Two tertiary text
> colours were darkened for WCAG-AA contrast — the shelf-tab code (→ `--brass-700`) and
> the "Borrowed" pill (→ a darker grey). The other screens have no design files; their
> clean defaults stand (and need a design pass).
>
> **E2E backend:** the gateway now requires Postgres, so the Playwright `webServer`
> provisions a throwaway, freshly-seeded Postgres in **Docker** (`scripts/start-gateway.sh`)
> and the gateway auto-migrates/seeds it. Running E2E needs Docker available.
>
> **Token storage:** the JWT is kept in `localStorage` so the session survives reload
> (acceptable for this SPA, but XSS-exposed). Planned hardening: an httpOnly,
> SameSite cookie issued by the backend.
>
> **Deferred:** admin role assignment (`POST /users/{id}/roles`) is M4 (admin/RBAC)
> per the plan — deferred, not built.
>
> **Presentational, not yet wired:** the detail **Reserve** action, the appbar search,
> and the list filter chips render for design fidelity but have no contract backing
> (no reserve endpoint; search/category filters aren't in the contract).

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
