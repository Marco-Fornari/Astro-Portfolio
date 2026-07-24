# Marco Fornari — Portfolio (Astro)

Immersive single-page portfolio. Continuous vertical scroll, pinned cinematic
hero with a scroll-driven "inspection" of a second image layer, a physics canvas
used purely as a horizontal transition between chapters, IT/EN i18n, and a
light/dark theme. No external runtime frameworks — Astro + vanilla CSS/JS.

## Stack
- **Astro** (static output) — component structure + build
- **CSS** — `src/styles/global.css` (design tokens as HSL variables)
- **JavaScript** — ES modules in `src/scripts/`
- **Netlify** — `netlify.toml` (build + security headers)

## Structure
```
public/
  hero-surface.jpg      # layer 1 (surface)
  hero-analysis.jpg     # layer 2 (revealed on inspection)
src/
  layouts/Base.astro    # <head>, header, canvas, scroll button, script entry
  pages/index.astro     # assembles the four chapters
  components/
    Hero.astro
    About.astro
    Experience.astro
    Contact.astro
  styles/global.css
  i18n/dictionary.js     # IT / EN strings
  scripts/
    state.js             # shared viewport + pointer + routes
    theme.js             # tokens → canvas RGB + light/dark toggle
    system-canvas.js     # verlet transition physics
    hero.js              # pinning + scroll-driven reveal
    scroll.js            # chapter observers, nav, progress, scroll button
    i18n.js              # apply translations + language switch
    main.js              # boots modules + single RAF loop
```

## Run
```bash
npm install
npm run dev      # local dev server
npm run build    # outputs static site to dist/
npm run preview  # preview the production build
```

## Deploy to Netlify
1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings are auto-read from `netlify.toml`
   (`build: npm run build`, `publish: dist`). Deploy.
   - Or drag-and-drop the `dist/` folder after a local `npm run build`.

## Customise
- Replace the placeholder links in `src/components/Contact.astro`
  (email / GitHub / LinkedIn) and add your real `MarcoFornari_CV.pdf` to `public/`.
- Colours live as HSL tokens at the top of `src/styles/global.css`
  (`:root` = light, `.dark` = dark).
- Translations: `src/i18n/dictionary.js`.
- Set your domain in `astro.config.mjs` (`site:`).
