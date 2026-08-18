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
- Tiptap 3 wiring (StarterKit scoped to the formats we promised, not a kitchen-sink editor).
- Share panel against the seeded teammate directory instead of a free-form email ACL admin.

## What I changed or rejected from the model

- NextAuth / OAuth.
- `.docx` import.
- Role-based sharing.
- Realtime collaboration.
- Auto commit/push.
- Dark-mode template chrome and “Create Next App” homepage.
- Next.js 16 deprecated `middleware.ts`; used `src/proxy.ts` instead.
- Extra Tiptap surfaces (code blocks, quotes, links, strike) — the spec asked for a usable editor, not Google Docs chrome.
- Passing Tiptap `getJSON()` objects into a Server Action. Nested lists/headings tripped Next’s serializer (`toStringTag` / client reference). Saves now send a JSON string and parse on the server. A failed save shows Retry instead of hanging on “Saving…”.

## How I verify

**Login slice:** Docker, migrate, seed; `/` redirects to `/login`; demo accounts on the login page.

**Editor slice:** Create a brief, type title and formatted body, confirm Saving → Saved, refresh and see the same JSON/formatting, go home and see it under Yours. Open a made-up `/briefs/not-a-real-id` for the not-found page.

**Sharing slice:** Alex shares with Jordan; Jordan sees it under Shared with you and can edit; Sam cannot open it; Alex can revoke. No viewer-only role.

## Working agreement

I review every Agent diff. Commits should tell a story (scaffold/auth, then documents, then editor, then sharing, then import) — not one dump and not noise. Agent does not run `git commit` or `git push`.
