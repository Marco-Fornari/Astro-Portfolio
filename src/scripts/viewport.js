/* =========================================================
   VIEWPORT — metriche condivise (W, H, DPR, mobile)
   ---------------------------------------------------------
   Prima vivevano nel canvas di transizione (system-canvas.js),
   rimosso insieme al suo sweep di nodi: la transizione di rotta
   è ora route-flush.js. hero.js dipende ancora da queste
   metriche, quindi restano qui — senza canvas, senza loop.
   ========================================================= */
import { view } from "./state.js";

function measure() {
  view.DPR = Math.min(devicePixelRatio || 1, 2);
  view.W = innerWidth;
  view.H = innerHeight;
  view.mobile = view.W < 700;   /* stesso confine della media query 699px */
}

export function initViewport() {
  measure();
  addEventListener("resize", measure);
}
