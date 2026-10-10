# Ayyan Anwar — Portfolio

A responsive Next.js portfolio for recruiters and clients. Warm off-white, charcoal, and cobalt; local typography, subtle Motion parallax, two project stories, services, background, and a contact form.

## Preview

Requirements: Node.js 22+, npm.

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview, use `npm run build` followed by `npm start`.

## Brevo connection

1. Copy `.env.example` to `.env.local`.
2. Add your API key privately as `BREVO_API_KEY`.
3. Set `BREVO_SENDER_EMAIL` to an address verified in your Brevo account.
4. Keep `CONTACT_TO_EMAIL=contact@ayyan.tech`.
5. Set `SITE_URL` to the exact public origin on your host (for example, `https://ayyan.tech` only if that is your deployed address).
6. Restart the server after changing environment variables.

The key stays on the server. The visitor's email is used as Reply-To, never as the sender. The handler validates input, bounds request size, checks the browser origin, rejects a honeypot, and limits repeated attempts per server process. Missing credentials and failed/ambiguous sends show an honest error with a direct-email fallback.

Before a public multi-instance launch, add a shared rate limit at the hosting/WAF layer. The in-memory limiter is not a durable, shared quota. Trust `x-real-ip` only when your host replaces it. No visitor data is written to disk by this application; submitted enquiries are sent to Brevo and the owner's inbox. Review your own provider retention settings for deployment.

No real email was sent during automated testing. Delivery must be checked after adding real credentials. Brevo accepting a request does not guarantee inbox delivery; review its delivery logs.

## Hosting

Deploy this as a Next.js application to a host supporting server route handlers, such as Vercel, or run `npm run build` / `npm start` on a Node server. Set the four environment variables above in the host dashboard. This is not a static GitHub Pages build: the contact endpoint needs a server. This repository does not configure or publish a domain automatically.

## GitHub

The approved target is the public `ayyananwar/portfolio` repository. If the isolated workspace cannot read your Windows GitHub credentials, run the included `publish.ps1` from your normal authenticated PowerShell. It creates the repository if absent, checks the target, and pushes the prepared main branch without force pushing.

## Checks

```powershell
npm run lint
npm test
npm run build
npm run test:browser
```

Install the test browser once with `npx playwright install chromium --only-shell`. Browser checks use Chromium; to use installed Edge instead, set `BROWSER_CHANNEL=msedge`. They cover navigation, project interaction, client validation, failed and mocked successful enquiry states, accessible labels/contrast, reduced motion, mobile overflow, and readable server-rendered content without JavaScript. API tests mock Brevo and exercise validation, provider failure, receipt checking, body size, and rate limiting.

The generated development-tool dependency tree currently reports an upstream `braces` advisory through Next's lint tooling. No patched braces release was available at creation time; `npm audit --omit=dev` checks the deployed runtime separately. Revisit the lint dependencies when a compatible upstream patch becomes available.

## Content approval

Personal content is centralized in `src/lib/content.ts`. Only approved introduction, two projects, four services, about paragraph, phone, public email, GitHub, and LinkedIn are included. Project diagrams are illustrative, not screenshots or research results. Employers, role dates, grades, achievements, portrait, and downloadable resume were not approved and are not included. Ask Ayyan before adding or changing personal content.

## Design sources

Official shadcn/ui registry components and adapted Tailark Mist section structures are documented in `THIRD_PARTY_NOTICES.md`, with upstream MIT licenses in `licenses/`. Diagrams and portfolio-specific styling are original.
