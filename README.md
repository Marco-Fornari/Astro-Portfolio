# Marco Fornari — Portfolio

Single-page portfolio with a "system / terminal" identity: numbered chapters,
monospaced technical typography, and interactions that read like a machine
processing information rather than a website showing off.

**Live:** https://mfornaridev.netlify.app

No runtime framework. Astro compiles the components away at build time, so what
reaches the browser is HTML, CSS and eight vanilla ES modules — about **16 kB of
JavaScript (6 kB gzipped)** for the whole site.

## Stack

| Layer | Choice |
|---|---|
| Build | [Astro](https://astro.build) 4 — `output: 'static'`, no adapter, no integrations |
| Components | `.astro` templates with **zero hydration** (no `client:*` directives) |
| Styling | One hand-written `global.css`, design tokens as HSL custom properties |
| Behaviour | Vanilla ES modules, bundled by Vite into a single hashed chunk |
| Graphics | Canvas 2D, used only for the hero's scroll-driven reveal |
| i18n | Runtime dictionary (IT / EN), persisted in `localStorage` |
| Fonts | System stacks only — no webfont requests |
| Hosting | Netlify (Node 20), static `dist/` + security headers |

## Structure

```
public/
  hero-1.jpg              # surface layer
  hero-2.jpg              # layer revealed under the pointer
  Marco_Fornari_CV.pdf
src/
  layouts/Base.astro      # <head>, header/nav, progress bar, script entry
  pages/index.astro       # assembles the four chapters
  components/
    Hero.astro            # pinned opening
    About.astro           # 01 / system profile
    Experience.astro      # 02 / system history
    Contact.astro         # 03 / open connection
  styles/global.css       # tokens, layout, every animation
  i18n/dictionary.js      # IT / EN strings
  scripts/
    main.js               # boots the modules, owns the single RAF loop
    state.js              # reduceMotion, viewport metrics, chapter list
    viewport.js           # keeps W / H / DPR / mobile up to date on resize
    theme.js              # parses the CSS HSL tokens into canvas-ready RGB
    hero.js               # hero pinning + canvas reveal of the second layer
    scroll.js             # active chapter (IntersectionObserver), nav, progress
    route-flush.js        # route transition on menu clicks
    i18n.js               # applies translations, language switch
```

## Implementation notes

**One animation loop for the whole page.** `main.js` owns the only
`requestAnimationFrame` loop; no module starts its own. It pauses on
`visibilitychange`, so a backgrounded tab does no work.

**CSS is the single source of truth for motion.** `route-flush.js` hardcodes no
durations: it reads `--rf-jump`, `--rf-in-at`, `--rf-hold` and `--rf-veil-out`
from `getComputedStyle`. Retiming the transition means editing the `--rf-*`
variables in `global.css` and nothing else.

**Tokens are shared between DOM and canvas.** Colours are declared once as HSL
triplets (`--primary: 3.9 85.6% 53.7%`). `theme.js` parses those same triplets
into `rgb()` strings for the canvas, so the drawn layer can never drift from the
styled one.

**The route transition** (`route-flush.js`) plays a three-beat sequence on menu
clicks: the outgoing chapter's log line falls away character by character, the
chapter counter advances (`01 → 02`), and the incoming line rebuilds left to
right. The scroll jump itself is instant and hidden behind the veil — note that
`scrollIntoView({behavior: "auto"})` inherits `scroll-behavior: smooth` from the
CSS, so it uses `"instant"` explicitly.

## Accessibility and performance

- Every animation runs on `transform` and `opacity` only — no layout thrash.
- `prefers-reduced-motion: reduce` replaces the per-character effects with short
  fades and shortens the transition to roughly 390 ms.
- Below 699 px the per-character split is dropped in favour of block movement
  (one animated layer per line instead of sixty), keeping the same palette and
  timing.
- Semantic landmarks, `aria-label` on every icon-only control, visible
  `:focus-visible` outlines.

## Security headers

`netlify.toml` ships a restrictive baseline, verifiable at
[securityheaders.com](https://securityheaders.com):

```
Content-Security-Policy: default-src 'self'; img-src 'self' data:;
  style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self';
  connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
```

`script-src 'self'` is the reason this project carries no CDN dependencies: an
external script tag would be blocked in production even though it works locally.
Hashed assets under `/_astro/` are served immutable for a year.

## Run

```bash
npm install
npm run dev      # dev server on http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the production build locally
```

## Deploy

Netlify reads `netlify.toml` (`npm run build` → publish `dist/`). Push to the
connected branch and it builds.

## Customise

- **Colours** — HSL tokens at the top of `src/styles/global.css`.
- **Transition timing** — the `--rf-*` variables in the `ROUTE FLUSH` block.
- **Copy** — `src/i18n/dictionary.js` (IT and EN must stay in sync; every
  `data-i18n` key in the components needs an entry in both).
- **Domain** — `site:` in `astro.config.mjs`.
