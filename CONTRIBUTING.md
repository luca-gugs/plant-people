# Contributing to Tend

Thanks for your interest in contributing! This document covers everything you need to get the project running locally and submit changes.

## Development Setup

### 1. Fork and clone

```bash
git clone https://github.com/luca-gugs/plant-people.git
cd plant-people
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `VITE_CONVEX_URL` once you have a Convex project (step 3).

### 3. Create a Convex project

```bash
npx convex dev --until-success
```

Log in when prompted, create a new project, and note your deployment URL. Then set the backend environment variables:

```bash
npx convex env set CONVEX_SITE_URL http://localhost:5173
npx convex env set AUTH_RESEND_KEY re_your_key_here
npx convex env set AUTH_EMAIL "Tend <hello@yourdomain.com>"
```

For `AUTH_RESEND_KEY`, create a free [Resend](https://resend.com) account and generate an API key. For `AUTH_EMAIL`, the sending domain must be verified in Resend (or use their shared `onboarding@resend.dev` domain for local testing only — see Resend docs).

### 4. Run the dev server

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173) with the Convex backend running in parallel.

## Code Conventions

- **File names:** kebab-case — `plant-card.tsx`, `search-bar.tsx`
- **Forms:** always use [react-hook-form](https://react-hook-form.com/) for form state
- **Backend:** all server logic lives in `convex/` — read `convex/_generated/ai/guidelines.md` before modifying Convex code
- **Styling:** Tailwind CSS 4 utility classes only — no custom CSS files

## Project Layout

```
src/pages/        # One directory per route
src/components/   # Shared components (kebab-case filenames)
src/contexts/     # React context providers
convex/           # All backend functions and schema
```

## Submitting Changes

1. Create a branch off `main`: `git checkout -b your-feature`
2. Make your changes and confirm `npm run lint` passes
3. Open a pull request with a clear description of what changed and why
4. Keep PRs focused — one feature or fix per PR

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs. actual behavior
- Browser/OS if it's a UI issue
- Any relevant console errors

## Hardware Notes

The ESP32 firmware is not included in this repository. The app uses [esp-web-tools](https://esphome.github.io/esp-web-tools/) to flash devices in-browser. If you're working on the device integration, see `convex/http.ts` for the HTTP endpoints the firmware communicates with, and `project-plan.md` for the full schema and hardware communication design.
