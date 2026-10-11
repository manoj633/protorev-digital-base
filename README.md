# Protorev Digital: Engineering Drawing Specification System

This repository contains the source code for the Protorev Digital studio web surface, constructed as a technical drafting and revision sheet system.

---

## 1. Architecture and Tech Stack

- **Framework**: Astro 5 (Static Output)
- **Styling**: Native CSS custom properties with strict 8-color engineering token whitelist (`src/styles/tokens.css`)
- **Typography**: Self hosted font packages (*Newsreader*, *Schibsted Grotesk*, *Martian Mono*)
- **Routing**: Static file generation with true 301 redirects in `vercel.json`
- **Search Optimization**: `@astrojs/sitemap` integration and explicit canonical tags pointing to `https://www.protorevdigital.com`
- **Form Proxy**: Vercel Serverless Function proxy (`api/contact.ts`) forwarding submissions to self hosted n8n webhooks with bot mitigation

---

## 2. Local Development & Operational Commands

```bash
# Install dependencies
npm install

# Start local Astro development server (http://localhost:4321)
npm run dev

# Compile full static production build (outputs to dist/)
npm run build

# Preview compiled production build locally
npm run preview

# Run the automated truth rules and style audit
npm run audit
```

---

## 3. Unknown Data & Confirmation Checklist (`TODO_CONFIRM`)

In adherence with our Truth Rules, zero metrics, team details, or client names are fabricated. All unverified items in `src/data/config.ts` use the string `TODO_CONFIRM` and must be resolved prior to commercial release:

- [ ] **City / Geographic Base**: Confirm primary registered city location in `studioConfig.city`.
- [ ] **Direct Contact Email**: Confirm mailbox creation for `hello@protorevdigital.com` and toggle `contactEmailConfirmed: true`.
- [ ] **Booking Link**: Update `studioConfig.bookingLink` with active scheduling URL.
- [ ] **Social Profiles**: Update GitHub, Twitter/X, and LinkedIn URLs in `studioConfig.social`.
- [ ] **Privacy Retention Period**: Confirm data retention schedule in `studioConfig.privacy.dataRetentionPeriod`.
- [ ] **Privacy Officer Contact**: Designate responsible privacy contact in `studioConfig.privacy.privacyOfficerContact`.
- [ ] **Pilot Pricing & Duration**: Confirm public pilot fee and delivery timeframe in `studioConfig.pilot`.

---

## 4. Production Ingress & n8n Integration Guide

The contact node (`/api/contact`) acts as a secure reverse proxy to your self hosted n8n workflow engine.

### Required Environment Variables

Configure these secrets in your Vercel project settings:

| Variable | Description | Example / Note |
|---|---|---|
| `N8N_WEBHOOK_URL` | Direct destination webhook in your n8n workflow | `https://n8n.yourdomain.com/webhook/contact-ingress` |
| `N8N_WEBHOOK_SECRET` | Shared secret sent via `X-Webhook-Secret` header | High entropy random string |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key | Cloudflare dashboard secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public Turnstile site key exposed to the client | Cloudflare dashboard site key |

### Recommended n8n Node Sequence:
1. **Webhook Trigger**: Set HTTP Method to `POST`. Configure Header Authentication verifying `X-Webhook-Secret`.
2. **Respond to Webhook Node**: Return immediately with `{ "ok": true, "executionId": $execution.id }` so the user receives instantaneous feedback.
3. **Data Sanitization & Ingestion**: Validate schema and insert record into your operational audit database.
4. **Operations Dispatch**: Send notification alert to internal communications channel.
