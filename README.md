# craigdennis.me

Static site for Craig Dennis — B2B SaaS organic growth consulting (SEO, content, AI-search).

## Site structure

| Path | Purpose |
|------|---------|
| `/` | Marketing homepage — services overview, proof, 30-day sprint CTA |
| `/services/` | Services hub linking to case-study pages |
| `/sprint/` | 14-Day Evaluation Stage Capture Sprint™ (legacy offer page) |
| `/seo-architecture/` | SEO architecture case study + CV |
| `/content-demand/` | Content & demand generation case study + CV |
| `/ai-growth/` | AI / LLM visibility case study + CV |
| `/leakage-scan.html` | Evaluation Revenue Leakage Scan™ |

Homepage primary CTA: **Start a 30-day sprint** → [Calendly](https://calendly.com/craigdennis1990/1-1-consultation). Sprint subpage copy is still the 14-day evaluation sprint; update separately when the offer is finalized.

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

- Homepage / services sprint buttons: Calendly link in `index.html` and `services/index.html`.
- Sprint page: `sprint/index.html` (`#cta-link` or hero CTA).
- Stat counters: `main.js` (`initStatCounters`) + `[data-count]` attributes on the homepage.

## Before launch checklist

- Replace the placeholder testimonial in `index.html` (`<!-- TESTIMONIAL: ... -->` block).
- Add client logos under `images/logos/` if you have permission (strip is text-only for now).
