/* =========================================================
   STATE — shared runtime values across canvas / hero / scroll
   ========================================================= */

export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const MONO = 'ui-monospace,"SF Mono","Cascadia Code",Menlo,Consolas,monospace';

/* viewport metrics (updated by system-canvas resize) */
export const view = { W: 0, H: 0, DPR: 1, mobile: false };

/* pointer */
export const ptr = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, speed: 0 };

addEventListener("pointermove", e => {
  ptr.px = ptr.x; ptr.py = ptr.y;
  ptr.x = e.clientX; ptr.y = e.clientY;
  ptr.vx = ptr.x - ptr.px; ptr.vy = ptr.y - ptr.py;
  ptr.speed = Math.min(60, Math.hypot(ptr.vx, ptr.vy));
}, { passive: true });

/* the four narrative chapters, in order */
export const routes = ["home", "about", "experience", "contact"];
