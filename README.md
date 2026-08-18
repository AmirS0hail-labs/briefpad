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

Run tests:

```bash
npm test
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

Working: sign in/out, create/rename/edit briefs with autosave, import `.md`/`.txt` as a new brief, share with a seeded teammate, owned vs shared lists.

### Import

Home → **Import file**. Markdown and plain text only, **up to 1MB**. `.docx` is not supported (stated on the home screen). A sample file is at `docs/sample-brief.md`.

### Sharing demo

1. Sign in as **Alex**, open a brief, click **Share**, share with **Jordan Chen**.
2. Sign out, sign in as **Jordan**. The brief is under **Shared with you** (not Yours). Jordan can edit.
3. Sign in as **Sam** — the brief should not appear, and a direct link shows **No access**.
4. As Alex, **Remove** Jordan to revoke.

## File import limits

Markdown (`.md`) and plain text (`.txt`) only, up to 1MB. Word (`.docx`) is out of v1.

## Live deploy

Production is **Render + Neon Postgres**. Vercel was skipped: that account is a suspended Pro team, not a usable Hobby plan.

1. Commit and push this repo to GitHub (Render deploys from `main`).
2. In Render: **New** → **Blueprint** (or **Web Service**) → select `AmirS0hail-labs/briefpad`.
3. When prompted for env vars:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** URL (`-pooler` in the host, `sslmode=require`) |
| `DIRECT_URL` | Neon **direct** URL (no `-pooler`) |
| `SESSION_SECRET` | Render can generate this (`generateValue` in `render.yaml`) |

4. Wait for the first deploy. The build runs `prisma migrate deploy` and seeds Alex / Jordan / Sam.

The public URL will look like `https://briefpad.onrender.com`. Use the **Free** instance (spins down when idle). Do not pick **Starter** ($7/month).

Preferred review path: the live URL + the demo logins above. Local Docker is for development, not for the Drive zip.
