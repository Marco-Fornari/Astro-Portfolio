/* =========================================================
   STATE — shared runtime values across hero / scroll / transition
   ========================================================= */

export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const MONO = 'ui-monospace,"SF Mono","Cascadia Code",Menlo,Consolas,monospace';

/* viewport metrics (updated by viewport.js on resize) */
export const view = { W: 0, H: 0, DPR: 1, mobile: false };

/* the four narrative chapters, in order */
export const routes = ["home", "about", "experience", "contact"];
