/* =========================================================
   MAIN — boots every module and drives the single RAF loop
   ========================================================= */
import { initTheme } from "./theme.js";
import { initLang } from "./i18n.js";
import { initSystemCanvas, frameSystem } from "./system-canvas.js";
import { initHero, frameHero } from "./hero.js";
import { initScroll } from "./scroll.js";

initTheme();
initLang();
initSystemCanvas();
initHero();
initScroll();

let running = true, rafId = 0;
function loop() {
  if (!running) return;
  frameHero();    // hero pinning + scroll-driven reveal
  frameSystem();  // transition physics layer
  rafId = requestAnimationFrame(loop);
}
document.addEventListener("visibilitychange", () => {
  running = !document.hidden;
  if (running) loop(); else cancelAnimationFrame(rafId);
});
loop();
