# ChemLab

ChemLab is a free, static-first chemistry learning site: short lessons, interactive simulations, step-by-step calculators, quizzes and an optional AI tutor (ChemBot).

**Repository:** [github.com/johnemmanueldelmundo9-pixel/chemlab](https://github.com/johnemmanueldelmundo9-pixel/chemlab) · **Owner:** John Emmanuel Del Mundo

## What is in the site

- **8 modules planned.** Modules 1 (lab safety) and 2 (basic concepts) are ready; the rest show as “Soon”.
- **Module 1:** lab conduct, 5S housekeeping, glassware, chemical handling and storage, GHS, PPE, waste, first aid and spills, with Wikimedia Commons photographs.
- **Module 2 calculators:** significant figures, scientific notation, unit conversion, density/temperature/percent error, molar mass and moles. Every calculator shows the formula, the substitution, the steps, the units and the significant figures.
- **Periodic table:** all 118 elements with details, keyboard navigation and colour modes.
- **Optional accounts:** Supabase email/password auth and cross-device progress sync. The site works fully without an account.
- **ChemBot:** an AI tutor served by a Vercel function, with chemistry-only rules and a per-IP rate limit.

## Run it locally

No build step and no npm install. ES modules need HTTP, not `file://`.

```powershell
python -m http.server 8123
```

Then open <http://127.0.0.1:8123/>. Use a cache-busting query such as `?v=2#/module/intro-lab-safety` while editing JavaScript.

Run the chemistry tests with Node 18+:

```powershell
node tests/chemistry.test.mjs
```

## Deploy

The site deploys to Vercel as static files plus one serverless function.

1. Upload the repository contents (keep `index.html` at the root; keep the `src`, `api`, `supabase` and `tests` folders as folders).
2. In **Vercel → Settings → Environment Variables**, set at least one AI key:
   - `DEEPSEEK_API_KEY` and/or `GEMINI_API_KEY`
   - optional: `AI_PROVIDERS`, `DEEPSEEK_MODEL`, `GEMINI_MODEL`, `RATE_LIMIT`
3. Never put those keys in `src/config.js` or in GitHub. Only the public Supabase URL and publishable key belong there.

## Accounts and data

- Supabase setup SQL: [`supabase/schema.sql`](supabase/schema.sql).
- Account deletion: [`supabase/functions/delete-account/index.ts`](supabase/functions/delete-account/index.ts) plus the emailed confirmation flow.
- Without an account, theme and progress stay in the browser.
- With an account, the site stores only the email, a password hash and progress rows.
- ChemBot messages are sent through the server function to DeepSeek or Google Gemini. Do not type personal information into the chat.

## Privacy, terms and other policies

The site includes plain-language pages for:

- Privacy policy: `#/privacy`
- Terms of service: `#/terms`
- Cookies and browser storage: `#/cookies`
- Accessibility statement: `#/accessibility`
- Credits and licences: `#/credits`
- Contact and site details: `#/contact`

The owner and contact details live in one place: [`src/data/site.js`](src/data/site.js). Update that file if the details change, then update the date on each policy page.

> These pages describe how the project works, but they are not a substitute for legal advice. If the site becomes commercial or collects more data, have the policies reviewed by a qualified lawyer.

## Images and licences

Lesson photographs are bundled in [`src/assets/lab/`](src/assets/lab/) and credited in [`src/assets/lab/CREDITS.md`](src/assets/lab/CREDITS.md). They come from Wikimedia Commons under CC BY, CC BY-SA or public-domain terms; keep the attribution when reusing them.

The site uses system fonts only, so no font files are distributed.

## Project structure

```
index.html          entry page
vercel.json         function timeout
api/chat.js         ChemBot server function (AI keys stay here)
src/
  main.js           boot
  router.js         hash router
  config.js         public Supabase URL + publishable key
  data/             modules, lessons, elements, site facts
  pages/            home, module reader, periodic table, legal pages
  components/       header, dialogs, chat, storage notice
  lib/              auth, progress, widgets, chemistry maths
  styles/           tokens, layout, components, lesson, chat
  assets/lab/       credited lesson images
supabase/           schema and delete-account function
tests/              chemistry tests
```

## Tests and checks

```powershell
node --check src/main.js
node tests/chemistry.test.mjs
```

There is no automated accessibility or end-to-end test suite yet; the accessibility statement lists what has been checked manually.
