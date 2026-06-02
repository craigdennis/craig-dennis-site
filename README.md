# craigdennis.me

Static site for Craig Dennis — B2B SaaS organic growth consulting (SEO, content, AI-search).

## Site structure

| Path | Purpose |
|------|---------|
| `/` | Marketing homepage — services overview, proof, 30-day sprint CTA |
| `/work/` | Portfolio — Hightouch case studies, published writing, product builds |
| `/services/` | Services & pricing — 30-Day Sprint ($5k), retainer, à la carte |
| `/services/#sprint` | Primary offer: The 30-Day Sprint |
| `/sprint/` | Redirects to `/services/#sprint` (legacy URL) |
| `/seo-architecture/` | SEO architecture case study + CV |
| `/content-demand/` | Content & demand generation case study + CV |
| `/ai-growth/` | AI / LLM visibility case study + CV |
| `/leakage-scan.html` | Evaluation Revenue Leakage Scan™ |
| `/contact/` | Qualifying contact form (Tally embed) |
| `/contact/thanks/` | Post-submit thank you |

Homepage primary CTA: **Start a 30-day sprint** → `/contact/`. Services page hero CTA: **Book a sprint call** → `/contact/`.

### Tally contact form

1. Create a form at [tally.so](https://tally.so) with fields: **Name**, **Email**, **Company**, **What you need** (multiple choice: `30-Day Sprint`, `Ongoing retainer`, `Standalone / à la carte`), **Message** (long text).
2. **Share → Embed** → form ID in `contact/tally-config.js` (`TALLY_CONTACT_FORM_ID`).
3. After submit, the embed script redirects to `/contact/thanks/` (`TALLY_CONTACT_THANKS_URL`). Optional: also enable **Redirect on completion** in Tally for visitors who use the standalone `/r/` link.

## Deploy to Vercel

### Option A: Deploy with Vercel CLI

1. Install the Vercel CLI (one time):

   ```bash
   npm i -g vercel
   ```

2. From this folder, run:

   ```bash
   vercel
   ```

3. Production:

   ```bash
   vercel --prod
   ```

### Option B: Deploy from GitHub

1. Push to GitHub.
2. [vercel.com](https://vercel.com) → **Add New** → **Project** → import repo.
3. Deploy (no build step required).

## Domain (craigdennis.me)

1. Vercel project → **Settings** → **Domains** → add `craigdennis.me` (and optional `www`).
2. Configure DNS at your registrar per Vercel’s instructions.

## Local preview

```bash
npx serve .
```

Open the URL shown (e.g. http://localhost:3000).

## Edit CTAs

- Primary contact path: `/contact/` (Tally form ID in `contact/tally-config.js`).
- Calendly is no longer linked from main CTAs; share your calendar link in email replies after qualifying.
- Stat counters: `main.js` (`initStatCounters`) + `[data-count]` attributes on the homepage.

## Before launch checklist

- Add client logos under `images/logos/` if you have permission (strip is text-only for now).
- On `/work/`: replace `<!-- PUBLISHED: replace -->` article cards with live URLs; confirm WriteSaaS URL (`<!-- WRITESAAS: ... -->`) and GetGainStrong metrics (`<!-- GETGAINSTRONG: ... -->`).
