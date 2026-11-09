# spweb — SenangPlanner

Editorial wedding and event planning website built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_WA_NUMBER` to the WhatsApp number in international format without `+`.
3. Optionally set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_AVAILABILITY_CSV_URL`.
4. Run `npm install`, then `npm run dev`.

## Editable content

Content is kept in `data/*.ts`:

- `site.ts`: region and real social/review links.
- `about.ts`, `vision.ts`: about copy, pillars and statistics.
- `services.ts`, `packages.ts`: service details and WhatsApp enquiry text.
- `reviews.ts`, `team.ts`, `gallery.ts`: client-approved reviews, portraits, event photos and reel links.
- `availability.ts`: fallback availability data and calendar note.

The photo positions currently display sample images from the supplied HTML reference so the layout is visible without blank placeholders. They are illustrative only, not SenangPlanner client work. Replace sample URLs and captions with client-approved images/reels before launch. Local photos can be added under `public/images` and referenced from the same content data.

## Availability sheet

Publish a Google Sheet as CSV and set its published CSV URL in `NEXT_PUBLIC_AVAILABILITY_CSV_URL`. Since GitHub Pages is static hosting, the browser fetches this public CSV directly; the sheet must be published with access for visitors. The header row must contain `date,status,note`; dates use `YYYY-MM-DD` and statuses are `kosong`, `hampir-penuh`, or `penuh`. The `note` column is optional. Keep the fallback list in `data/availability.ts` current if no sheet is configured.

## GitHub Pages deployment

The `main` branch deploys through `.github/workflows/deploy.yml` to `https://raimi-akasyah.github.io/spweb/`. The workflow exports a static site and publishes the `out/` folder. In repository Settings → Secrets and variables → Actions → Variables, optionally set `NEXT_PUBLIC_WA_NUMBER` and `NEXT_PUBLIC_AVAILABILITY_CSV_URL` for the public contact number and published sheet URL. GitHub Pages cannot run Next.js API routes or server code.

## Before launch

- Replace all sample copy and contact details.
- Add the real Google Maps review URL and social links.
- Confirm photo, review and reel permissions.
- Set the production site URL and Google Sheet URL.
