# Briefpad

**Live:** https://briefpad.onrender.com  
**Repo:** https://github.com/AmirS0hail-labs/briefpad  
**Video:** https://www.loom.com/share/2cc6aac1b2014ac68920a13a4c543bcc

Walkthrough is silent (Loom mic permission failed in the timebox). Sequence: Alex signs in → new brief + formatting + Saved → share with Jordan → Jordan edits under Shared with you → Sam has no access. Cuts: no realtime, no viewer role, no `.docx`.

**Logins** (password `briefpad-demo`):
- alex@briefpad.app — Alex Rivera
- jordan@briefpad.app — Jordan Chen
- sam@briefpad.app — Sam Okonkwo

First hit after idle can take ~30–50s (Render Free). If Sign in or save fails once, retry — Neon is waking.

**What works:** sign in, new brief, Tiptap (bold/italic/underline, H1/H2, lists), autosave, refresh persistence, share/revoke with seeded teammates, Yours vs Shared, import `.md`/`.txt` ≤1MB as a new brief, access tests.

**What was cut:** realtime/CRDT, RBAC, `.docx`, OAuth/signup, comments/versions.

**Next 2–4 hours:** hide Neon cold-start from the first click; viewer vs editor; paid instance so the demo does not sleep.

**Drive:** GitHub is the source of truth. Zip is optional (exclude `.env`, `node_modules`, `.next`).
