---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/components/About.astro","src/components/Experience.astro","src/components/Contact.astro"]
---

# Surface brief — chapters 01–03 (About, Experience, Contact)

Mode: Experience. Hero (#home) is frozen and must not change. Copy and 01/02/03 structure are preserved; only presentation is replaced.
Audience: SOC recruiters and technical hiring managers; job: understand who Marco is. Constraints: IT/EN dictionary, system fonts, no new runtime deps, route-flush and scroll.js keep working.
Unresolved: none.

## Direction contract

THESIS: The career read as an Italian station departures poster: rows, times, a stop-line diagram. Refuses the card grid, the pill/tag wall and the icon-chevron buttons.
OWN-WORLD: The hero's night-blue ground (user choice, replacing signage yellow), light ink, a deeper-navy masthead band per chapter with red label, red only as a rare state mark. Helvetica-grade bold sans for headings, tabular mono only for times and numbers. Thick light rules, label|content table rows, one inverted (light block, dark text) row as the "selected departure". No gradients, glows, noise or rounded chips.
STORY: The visitor sees who Marco is (name, profile), reads the route Story → Code → System → Security as a stop line, finds Overguard as the highlighted departure, then reaches contact as full-width rows.
FIRST VIEWPORT: After the hero, black masthead band with the chapter label, then the name at ~96px left, lede right, a 6px rule, then label|content rows (Profilo, Percorso, Stack, Focus). Primary actions live in Contact rows.
FORM: Orario Partenze, assigned index 4, seed key 526c17b8.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
