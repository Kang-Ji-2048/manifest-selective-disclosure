# Manifest — selective-disclosure prototype

A working, Netlify-hostable proof-of-concept for **Manifest**: a system that lets
community contributors prove something happened — to funders, the public, or a court —
**without exposing the people who were there**.

Built for UCL Innovation Fest 2026 (Manifest Studio Collective × Amnesty International
APAC). React + Vite, no backend, no database, no cookies.

---

## The three views

Switch between them with the tabs in the top-right (in production these would be three
separate entry points; the switcher is here so judges can move between them).

| Route | View | Purpose |
| --- | --- | --- |
| `/me` | **Individual** | A non-technical contributor on a borrowed phone. Vault → What leaves → Proof → Audit, all in a phone frame. Plausible deniability: no cookies, no storage, idle auto-logout, one-tap wipe. |
| `/public` | **Public** | Two audiences. **Funders** get differentially-private impact figures, each with a zero-knowledge count proof they can verify. **Potential contributors** get a "you're not alone" nudge backed by private matching. |
| `/court` | **Court** | A vetted register of organisations only. Technical detail: metadata, Semaphore ZK verification, Bitcoin / OpenTimestamps anchoring, chain of custody, the 5-phase verification pipeline and the adversaries it defends against. |

## The four access levels

Set per piece of evidence on the **What leaves** screen. The first three are reversible;
the fourth is one-way and asks for explicit consent.

1. **No disclosure** — sealed on device, shared with no one (safe default).
2. **Partial disclosure** — used only to corroborate other evidence via a Semaphore
   nullifier (counted once, never linkable).
3. **Public disclosure** — anonymised, publishable; feeds the verifiable funder figures.
4. **Court disclosure** — full sealed record to one named court (BBS+ selective
   disclosure). Identifying. Irreversible.

## What's faithful to the architecture

- **Proofs, not databases** — only identity-free attestations and ZK proofs ever
  aggregate; there is no central honeypot to seize.
- **Semaphore** for anonymous group-membership counting (chosen over Iden3/Polygon ID and
  hand-rolled Groth16 for safety — the cost of an implementation error is someone getting
  arrested).
- **OpenTimestamps on Bitcoin** for tamper-evident timing; auto-disabled in deployment
  profiles where chain access is blocked or illegal.
- **Berkeley Protocol** review by a non-communicating, jury-style community verifier pool
  with revocable **Hats Protocol** roles.
- **Okabe–Ito** colour-blind-safe palette throughout, so the four levels are
  distinguishable for everyone.

This is a UI prototype. The cryptography is represented, not executed — proof IDs, hashes
and figures are illustrative.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build
```

## Deploy to Netlify

`netlify.toml` is already configured (build command, publish dir, SPA redirect, and
privacy headers). Choose one:

**A — drag & drop**

```bash
npm run build
```

Then drag the `dist/` folder onto <https://app.netlify.com/drop>.

**B — connect the repo**

Push this folder to a Git repo and "Add new site → Import" in Netlify. It auto-detects:

- Build command: `npm run build`
- Publish directory: `dist`

**C — CLI**

```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Privacy posture

No cookies, no `localStorage`, no analytics, no third-party scripts. All session state
lives in memory and disappears when the tab closes or after 90s idle. `netlify.toml` adds
`Cache-Control: no-store`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY` and a
restrictive `Permissions-Policy`.

## Project layout

```
src/
  theme.js                  Okabe–Ito palette + the four access levels
  data/mockData.js          all demo data (testimonies, aggregates, orgs, pipeline)
  state/SessionContext.jsx  in-memory session, auto-logout, wipe
  components/               AccessLevelBadge, PrivacyBar, Modal
  views/individual/         phone-frame contributor view
  views/public/             funder dashboard + contributor nudge
  views/court/              org gate + technical evidence detail
```
