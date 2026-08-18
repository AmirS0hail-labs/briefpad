# Submission

**Candidate:** Amir Sohail  
**Role:** Full Stack Product Engineer / AI-Native Full Stack Product Engineer  
**Product:** Briefpad — internal briefs for a small team (not a Google Docs clone)

## Links

- **Live URL:** https://briefpad.onrender.com
- **Source:** https://github.com/AmirS0hail-labs/briefpad
- **Walkthrough:** https://www.loom.com/share/2cc6aac1b2014ac68920a13a4c543bcc (silent — Loom mic failed in the timebox; same URL in `VIDEO_URL.txt`)

First load after idle can take 30–50s (Render Free). Neon also sleeps; if the first click errors, wait a few seconds and retry.

## Demo logins

Password for all: `briefpad-demo`

| Name | Email |
| --- | --- |
| Alex Rivera | alex@briefpad.app |
| Jordan Chen | jordan@briefpad.app |
| Sam Okonkwo | sam@briefpad.app |

## Reviewer path (about 4 minutes)

1. Open the live URL. Sign in as **Alex**.
2. **New brief**. Title + body with heading / list / bold. Confirm **Saved**. Refresh — content remains.
3. **Share** with Jordan. Sign out.
4. Sign in as **Jordan**. Brief is under **Shared with you**. Edit it.
5. Sign in as **Sam**. Brief is absent; a direct link shows **No access**.
6. Optional: home → **Import file** → `docs/sample-brief.md`.

## What works

- Seeded cookie auth (hashed passwords, httpOnly JWT), not OAuth.
- Create, inline rename, Tiptap editor, 800ms autosave as Tiptap JSON.
- Share / revoke; Yours vs Shared; every read/write authorized.
- Import `.md` / `.txt` up to 1MB as a **new** brief (no `.docx`).
- `npm test` — access rules + import (14 tests).
- Live deploy: **Render Free + Neon**. Vercel skipped (suspended Pro team). Railway trial had ended.

## What was cut (on purpose)

- Realtime / CRDT — last-write-wins.
- RBAC (viewer vs editor) — shared users can edit; only owner manages access.
- `.docx`, comments, versions, PDF export, signup / OAuth.

## Next 2–4 hours

- Warm the first query so idle Neon does not fail the first Sign in (retries are in the latest local changes).
- Presence / “someone else is here” without full CRDT.
- Viewer vs editor on `DocumentShare`.
- Paid Render instance so the demo does not spin down.

## Notes for reviewers

`README.md`, `ARCHITECTURE.md`, and `AI_WORKFLOW.md` are in the repo. Prefer the live URL over a Drive zip (no `.env` / `node_modules` in a zip).
