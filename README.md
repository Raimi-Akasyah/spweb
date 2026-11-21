# spweb — SenangPlanner

Editorial wedding and event planning website built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_WA_NUMBER` to the WhatsApp number in international format without `+`.
3. Optionally set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WA_NUMBER`, and `NEXT_PUBLIC_APPS_SCRIPT_URL`.
4. Run `npm install`, then `npm run dev`.

## Editable content

Content is kept in `data/*.ts`:

- `site.ts`: region and real social/review links.
- `about.ts`: company introduction, vision, mission, objectives and benefits.
- `services.ts`, `packages.ts`: service details and WhatsApp enquiry text.
- `reviews.ts`, `team.ts`, `gallery.ts`: reviews, team roles and the supplied company/package images.
- `availability.ts`: fallback availability data and calendar note.

The hero, team, vision/mission and package areas use images supplied for Senang Planners. Gallery captions are limited to the package and company information currently provided; add approved event photos when available.

## Booking storage and calendar

The homepage's **Book Event** and **Pick your date** buttons open the five-step event-pass wizard at `/booking/`; the booking flow is a separate page, not an inline homepage form. It collects contact details, date and time, venue, event type, requested services, guest count, theme and budget, deposit and balance amounts, optional payment-proof image, and consent to the terms. Submissions are stored as rows in the Google Sheet through the Apps Script web app in `apps-script/Code.gs`. The script confirms a date immediately, rejects a competing booking for the same date, and returns confirmed dates to the calendar. New columns are appended automatically when the script next accesses an existing bookings sheet.

In local development, use **Isi contoh (demo)** to preview the form with sample details. This only fills the browser form; it does not submit or attach a payment image. Keep the Apps Script URL unset while reviewing the draft.

The booking backend targets spreadsheet `1fBxefY_vrzAwi8JYqa_kwp3-PjppFrwJUe87PmElYVw`. The Apps Script project URL in a browser is an editor link, not the web-app endpoint needed by the site.

1. The Apps Script project's `Code.gs` is synchronized with `apps-script/Code.gs` and exposes `setup()`, `doGet()` and `doPost()`.
2. Run `setup()` once from the editor and approve the requested Sheets and Drive access. This creates the `Bookings` tab and a private Drive folder for optional payment-proof images.
3. Deploy as a **Web app**, execute as your account, and allow access to **Anyone** so the public site can submit. Copy the deployment URL ending in `/exec` (it is different from the project/editor URL).
4. Set `NEXT_PUBLIC_APPS_SCRIPT_URL` to that `/exec` URL in `.env.local` for local development. In GitHub, set it under **Settings → Secrets and variables → Actions → Variables**, then run **Deploy to GitHub Pages**.

Payment-proof uploads are limited to 10 MB and common image formats. Files stay private in the Drive folder; the sheet stores their Drive links. Confirm the full payment terms and account instructions before launch. The Google Form's account information is not automatically captured by this custom form; email is an optional field.

The script uses a honeypot, validates fields and uploaded image signatures, serializes booking writes with a lock, and checks for date conflicts. Because the endpoint is public, monitor the sheet and Drive folder for spam. Do not collect sensitive personal information in booking notes. A static GitHub Pages site cannot securely write to Sheets on its own; the Apps Script web app is the required backend.

The source form's payment instructions say full payment is due one day before the event, while its terms also allow payment on the event day. Resolve this difference and confirm the summarized terms and payment amounts before publishing.

## GitHub Pages deployment

The `main` branch deploys through `.github/workflows/deploy.yml` to `https://raimi-akasyah.github.io/spweb/`. The workflow exports a static site and publishes the `out/` folder. Optionally set `NEXT_PUBLIC_WA_NUMBER` as a repository Actions variable for WhatsApp links.

## Before launch

- Replace all sample copy and contact details.
- Add the real Google Maps review URL and social links.
- Confirm photo, review and reel permissions.
- Set the production site URL and Google Sheet URL.
