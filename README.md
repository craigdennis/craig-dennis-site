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

Homepage primary CTA: **Start a 30-day sprint** → [Calendly](https://calendly.com/craigdennis1990/1-1-consultation). Services page hero CTA: **Book a sprint call**.

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

- Homepage / services sprint buttons: Calendly link in `index.html` and `services/index.html` (`#sprint` section).
- Stat counters: `main.js` (`initStatCounters`) + `[data-count]` attributes on the homepage.

## Before launch checklist

- Add client logos under `images/logos/` if you have permission (strip is text-only for now).
- On `/work/`: replace `<!-- PUBLISHED: replace -->` article cards with live URLs; confirm WriteSaaS URL (`<!-- WRITESAAS: ... -->`) and GetGainStrong metrics (`<!-- GETGAINSTRONG: ... -->`).
