# AI workflow

Practical use of Cursor on Briefpad. Judgment stays with the author; the model does not own scope or git.

## Tools

- Cursor Plan mode, then Ask mode to interrogate the plan, then Agent to implement.
- No OAuth, no extra AI APIs in the product.

## Plan review (what I asked before writing code)

I treated the first plan as a draft, not a spec. Questions and how they landed:

- **Seeded login vs “real” auth:** Keep seeded cookie login. OAuth/NextAuth/signup rejected for reviewer friction and timebox. Session + hashed passwords still required.
- **`.docx` in v1:** Rejected. `.md` / `.txt` only, limits in UI and README.
- **1MB cap:** Kept as a product/platform bound (Vercel body size, demo safety, sane brief length).
- **Role-based ACL:** Rejected for v1. ACL still exists: owner vs shared-editor vs nobody. RBAC is stretch.
- **Postgres vs SQLite:** Postgres for the live URL; Docker Postgres for local. SQLite on Vercel would not persist.
- **Flowchart looked import-only:** Misread of a coarse diagram. **New blank brief is in scope** alongside import.
- **TDD?** Not for the whole app. Access helpers (`canAccessDocument`) exist so tests can lock sharing rules next — test-after on the invariant, not TDD of the UI.
- **Three models enough?** Yes: User, Document, DocumentShare.
- **`contentJson` and row size:** Native Tiptap JSON; typical briefs are small; 1MB import stays within JSONB/TOAST.
- **DocumentShare:** Join table; owner stays on Document.
- **Indexes:** Yes, on email, ownerId, share userId, unique share pair.
- **Git:** Agent must **not** commit or push. I review diffs and commit in story-sized chunks.
- **Races:** Last-write-wins; realtime skipped on purpose.
- **Env sharing:** `.env.example` in git; real `.env` and Vercel secrets never in Drive/GitHub.
- **Drive zip friction:** Live URL first; Docker so a downloaded folder can run without Neon.

This review stays in this file because the evaluation includes mature AI use and written communication — not only the running app.

## What sped things up

- Next.js App Router scaffold, Prisma schema, cookie session with `jose`, login form with demo teammate fill.

## What I changed or rejected from the model

- NextAuth / OAuth.
- `.docx` import.
- Role-based sharing.
- Realtime collaboration.
- Auto commit/push.
- Dark-mode template chrome and “Create Next App” homepage.
- Next.js 16 deprecated `middleware.ts`; used `src/proxy.ts` instead.

## How I verify (this slice)

- Docker Desktop was not running at first; started it, then `docker compose up`, migrate, seed. Three users in Postgres: Alex, Jordan, Sam.
- Unauthenticated `/` redirects to `/login`. Login page shows demo teammates and the shared password.
- `npm run lint` is clean. Session cookie signing uses `jose`; passwords are bcrypt hashes from seed.
- I did not treat a raw curl of a Next server action as the UX test — sign-in should be checked in the browser.

## Working agreement

I review every Agent diff. Commits should tell a story (scaffold/auth, then documents, then editor, then sharing, then import) — not one dump and not noise. Agent does not run `git commit` or `git push`.
