# Architecture

Briefpad is an internal writing tool: a coherent slice a small team could use, not a Google Docs recreation. The role is Full Stack **Product** Engineer — scope, tradeoffs, and a testable build matter as much as the stack.

## Product slice

- Blank **new brief** and **import** (`.md` / `.txt`) are both first-class. An early flowchart showed import more clearly than create; create-from-scratch was never cut.
- Home splits **Yours** and **Shared with you**.
- Editor (next): Tiptap with bold, italic, underline, headings, lists, debounced autosave.
- Sharing: owner grants access to a seeded teammate. Shared users can edit. No RBAC (viewer vs editor) in v1 — that is listed as stretch in the brief.
- Persistence: Postgres so a live deploy keeps documents after refresh.

Explicitly out of scope: realtime CRDT, comments, versions, PDF export, `.docx`, OAuth/signup.

## Why seeded login, not full auth

The assignment allows seeded accounts. Reviewers need to demonstrate sharing in minutes. OAuth or open signup adds env surface, callback URLs, and either spam or “use your Google account” friction. A closed teammate directory matches an internal tool.

What is still real: hashed passwords, httpOnly signed JWT cookie, logout, route gate via `src/proxy.ts`.

## Why Postgres

SQLite is fine on a laptop disk. The live app will run on Vercel, where the filesystem is ephemeral — SQLite would drop data on deploy. Neon Postgres is the production store. Locally, `docker-compose.yml` runs Postgres on port 5433 so reviewers do not need a Neon account to try the repo.

## Data model

Three tables are enough for identity, content + ownership, and extra access:

- `User` — seeded teammates.
- `Document` — title, `contentJson`, `ownerId`.
- `DocumentShare` — join table. Owner is **not** copied here; owner stays on `Document`.

Access: `userId === ownerId` OR a share row exists. Unique `(documentId, userId)` prevents duplicate grants.

Indexes: `User.email` (unique), `Document.ownerId`, `DocumentShare.userId`, unique pair on shares. No index on `contentJson` — we do not query inside the document body.

## `contentJson`

Tiptap’s native document is a ProseMirror JSON tree. Storing that round-trips marks and lists without a second parser. HTML as source of truth is an XSS footgun; Markdown cannot losslessly store underline. JSON is verbose and editor-specific; for this product the editor **is** the format.

Rough size: a short brief is tens of KB of JSON; a 1MB Markdown import may expand to a few MB. Postgres JSONB/TOAST handles that. The 1MB upload cap is a product/platform limit (Vercel body size, demo abuse, sensible brief length), not a database limit.

## Concurrency

Last-write-wins. No OT/CRDT, no document locks. Two people on the same brief: the later PATCH wins. Duplicate share inserts fail on the unique constraint. This is a deliberate cut, not an accident.

## File import (planned)

`.md` and `.txt` only, max 1MB, stated in the UI. `.docx` is a zip of XML with lossy mapping — unreliable in a timebox. Call the limit out rather than ship a flaky importer.

## Local vs Drive download

Preferred review path: **live URL** + demo logins. A Drive zip will not include `.env` or `node_modules`. README leads with Docker + `.env.example`. Do not commit secrets.
