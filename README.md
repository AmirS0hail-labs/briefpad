# Briefpad

Internal writing for a small team. Create a brief, keep formatting, and share it with a teammate.

This is a scoped product slice — not a Google Docs clone. Reviewers should use the **live URL** once it is deployed. Local setup is for development.

## Stack

- Next.js (App Router) + TypeScript
- Postgres (Docker locally, Neon in production)
- Prisma
- Signed httpOnly session cookie (seeded teammates, not OAuth)

## Local setup

Requires **Node 20+** and **Docker**.

```bash
cp .env.example .env
# SESSION_SECRET in .env must be at least 32 characters

npm install
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Docker Postgres is mapped to **host port 5433** so it does not clash with a local Postgres on 5432.

### Demo accounts

Same password for all: `briefpad-demo`

| Name | Email |
| --- | --- |
| Alex Rivera | alex@briefpad.app |
| Jordan Chen | jordan@briefpad.app |
| Sam Okonkwo | sam@briefpad.app |

## Current slice

Working: sign in/out, create a blank brief, rename via the title field, rich-text editing (bold, italic, underline, headings, lists), autosave, reopen after refresh. Home splits **Yours** and **Shared with you** (sharing itself is next).

Not built yet: import `.md`/`.txt`, sharing.

## File import limits (planned)

Markdown and plain text only, up to 1MB. `.docx` is out of v1.
