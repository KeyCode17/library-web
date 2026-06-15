# docs/designs

HTML design mockups — the **binding** visual spec for these screens. Per the build rules,
implement screens by slicing the actual markup here (layout, component structure, and the
design tokens in each file's `:root`), not from a summary.

Design system "Stacks": Fraunces (display) + Inter (body) + JetBrains Mono (call numbers).
Palette and spacing are CSS custom properties in `:root` — extract them verbatim.
Signature element: the **shelf-location tab** (`.shelf-tab`) — the app's rack·row book-finder.

Open any file in a browser to view. Every app screen has a binding mockup:

| Screen | Design file |
| --- | --- |
| Catalog list | `catalog.html` |
| Book detail | `catalog-detail.html` |
| Log in | `login.html` |
| Register | `register.html` |
| Forgot password | `forgot-password.html` |
| Reset password | `reset-password.html` |
| Verify email | `verify-email.html` |
| Account (self-service) | `account.html` |
| Manage users (admin) | `admin-users.html` |
| Loans (lending) | `loans.html` |
| Recommendations | `recommend.html` |
| Chat room picker | `chat-rooms.html` |
| Chat room view | `chat-room.html` |

Each mockup shows the real layout and every state (loading / empty / error / loaded,
plus flow-specific states like token-expired or unverified-email). The implementations
were sliced from this markup and verified screen-by-screen in a real browser.
