# craigdennis.me — Evaluation Stage Capture Sprint™

Single-page site for the 14-Day Evaluation Stage Capture Sprint. Built for [craigdennis.me](https://craigdennis.me).

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
   Follow the prompts (log in if needed). Your site will get a `*.vercel.app` URL.

3. To deploy to production:
   ```bash
   vercel --prod
   ```

### Option B: Deploy from GitHub

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Import the repo. Vercel will detect it as a static site.
4. Click **Deploy**. No build settings needed.

## Use your domain (craigdennis.me)

1. In the Vercel dashboard, open your project → **Settings** → **Domains**.
2. Add **craigdennis.me** and **www.craigdennis.me** (optional).
3. At your domain registrar, add the DNS records Vercel shows you:
   - **A** record: `76.76.21.21` (or the IP Vercel gives you).
   - Or **CNAME** for `www`: `cname.vercel-dns.com`.

Vercel will issue SSL automatically. After DNS propagates, the site will be live at craigdennis.me.

## Edit the CTA link

In `index.html`, set the “Book a call” button to your calendar:

- Find the line with `id="cta-link"` and set `href` to your Calendly/Cal.com (or other) link.
- In `main.js` you can alternatively set it via:  
  `document.getElementById('cta-link').href = 'https://calendly.com/your-link';`

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Then visit the URL shown (e.g. http://localhost:3000).
