/* =========================================================
   MAIN — boots every module
   ---------------------------------------------------------
   Nessun loop requestAnimationFrame perpetuo: hero.js e
   scroll.js chiedono un frame solo quando scroll, puntatore
   o resize cambiano qualcosa, e restano fermi altrimenti.
   ========================================================= */
import { initTheme } from "./theme.js";
import { initLang } from "./i18n.js";
import { initViewport } from "./viewport.js";
import { initHero } from "./hero.js";
import { initScroll } from "./scroll.js";
import { initSkills } from "./skills.js";
import { initRouteFlush } from "./route-flush.js";

initTheme();
initLang();
initViewport();
initHero();
initScroll();
initSkills();
initRouteFlush();
