/* =========================================================
   HERO — pinned opening, scroll-driven inspection of layer 2
   ========================================================= */
import { reduceMotion, MONO, view } from "./state.js";
import { ink, acc } from "./theme.js";

let heroProg = 0;
export const getHeroProg = () => heroProg;

const homeSec  = document.getElementById("home");
const inspector = document.getElementById("inspector");
const heroMedia = document.getElementById("heroMedia");
const imgBase  = document.getElementById("imgBase");
const heroId   = document.getElementById("heroId");
const heroVeil = document.getElementById("heroVeil");
const scrollBtn = document.getElementById("scrollBtn");
const rc   = document.getElementById("reveal");
const rctx = rc.getContext("2d");
const img2 = new Image();
img2.src = "/hero-analysis.jpg";
const scan = { x:-999, y:-999, tx:-999, ty:-999, on:false, amt:0 };

function sizeReveal() {
  const r = inspector.getBoundingClientRect();
  rc.width = Math.round(r.width * view.DPR);
  rc.height = Math.round(r.height * view.DPR);
  rctx.setTransform(view.DPR, 0, 0, view.DPR, 0, 0);
}
inspector.addEventListener("pointerenter", () => { scan.on = true; });
inspector.addEventListener("pointerleave", () => { scan.on = false; });
inspector.addEventListener("pointermove", e => {
  const r = inspector.getBoundingClientRect();
  scan.tx = e.clientX - r.left; scan.ty = e.clientY - r.top;
}, { passive:true });

function updateHero() {
  const r = homeSec.getBoundingClientRect();
  const span = r.height - innerHeight;
  heroProg = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  /* the scroll button belongs to the opening only: it dissolves as the hero is left behind */
  if (scrollBtn) {
    const btnA = Math.max(0, 1 - heroProg * 1.9);
    scrollBtn.style.opacity = btnA;
    scrollBtn.style.pointerEvents = btnA < 0.05 ? "none" : "auto";
  }
  if (reduceMotion) { heroVeil.style.opacity = 0; return; }
  /* identity recedes, surface zooms, page veil eases the hand-off */
  const p = heroProg;
  heroId.style.opacity = Math.max(0, 1 - p * 1.3);
  heroId.style.transform = `translateY(${-p * 70}px) scale(${1 - p * 0.06})`;
  heroMedia.style.transform = `scale(${1 + p * 0.07})`;
  heroVeil.style.opacity = Math.max(0, (p - 0.6) * 1.6);   /* earlier, gentler fade into the flow */
}

function drawReveal() {
  if (!img2.complete || !rc.width) return;
  const w = rc.width / view.DPR, h = rc.height / view.DPR;
  if (scan.x < -500) { scan.x = scan.tx; scan.y = scan.ty; }
  scan.x += (scan.tx - scan.x) * 0.16;
  scan.y += (scan.ty - scan.y) * 0.16;
  scan.amt += ((scan.on ? 1 : 0) - scan.amt) * (reduceMotion ? 1 : 0.1);

  rctx.clearRect(0, 0, w, h);

  const iw = img2.naturalWidth, ih = img2.naturalHeight;
  const sc = Math.max(w / iw, h / ih);
  const dw = iw * sc, dh = ih * sc;
  const dx = (w - dw) / 2, dy = (h - dh) / 2;
  const drawImg2 = () => rctx.drawImage(img2, dx, dy, dw, dh);

  /* 1 — scroll-driven scan: the analysis layer wipes down as the story advances */
  const edge = heroProg * (h + 6);
  if (edge > 0.5) {
    rctx.save();
    rctx.beginPath(); rctx.rect(0, 0, w, edge); rctx.clip();
    rctx.globalAlpha = 0.96;
    drawImg2();
    rctx.globalAlpha = 0.14;
    rctx.fillStyle = "#000";
    for (let y = 0; y < edge; y += 3) rctx.fillRect(0, y, w, 1);
    rctx.restore();
    if (edge < h - 2) {
      rctx.globalAlpha = 0.9;
      rctx.strokeStyle = acc(0.9);
      rctx.beginPath(); rctx.moveTo(0, edge); rctx.lineTo(w, edge); rctx.stroke();
      rctx.globalAlpha = 0.5;
      rctx.font = `9px ${MONO}`;
      rctx.fillStyle = ink(0.9);
      rctx.fillText(`ANALYSIS ${String(Math.round(heroProg * 100)).padStart(3, "0")}%`, w - 110, Math.max(edge - 10, 12));
      rctx.globalAlpha = 1;
    }
  }

  /* 2 — pointer lens: local inspection on top of the scroll scan */
  if (scan.amt > 0.01) {
    const R0 = Math.min(w, h) * (view.mobile ? 0.3 : 0.28) * scan.amt;
    const bandH = 70 * scan.amt;
    rctx.save();
    rctx.beginPath();
    rctx.arc(scan.x, scan.y, R0, 0, Math.PI * 2);
    rctx.rect(0, scan.y - bandH / 2, w, bandH);
    rctx.clip();
    rctx.globalAlpha = scan.amt;
    drawImg2();
    rctx.globalAlpha = 0.16 * scan.amt;
    rctx.fillStyle = "#000";
    for (let y = 0; y < h; y += 3) rctx.fillRect(0, y, w, 1);
    rctx.restore();

    rctx.globalAlpha = scan.amt;
    rctx.strokeStyle = ink(0.75);
    rctx.lineWidth = 1;
    rctx.beginPath(); rctx.arc(scan.x, scan.y, R0, 0, Math.PI * 2); rctx.stroke();
    rctx.strokeStyle = ink(0.28);
    rctx.beginPath();
    rctx.moveTo(0, scan.y - bandH / 2); rctx.lineTo(w, scan.y - bandH / 2);
    rctx.moveTo(0, scan.y + bandH / 2); rctx.lineTo(w, scan.y + bandH / 2);
    rctx.stroke();
    rctx.strokeStyle = acc(0.9);
    rctx.beginPath();
    rctx.moveTo(scan.x - 10, scan.y); rctx.lineTo(scan.x + 10, scan.y);
    rctx.moveTo(scan.x, scan.y - 10); rctx.lineTo(scan.x, scan.y + 10);
    rctx.stroke();
    rctx.globalAlpha = 1;
  }
}

/* ---------- public API ---------- */
export function initHero() {
  sizeReveal();
  new ResizeObserver(sizeReveal).observe(inspector);
}
export function frameHero() { updateHero(); drawReveal(); }
export { sizeReveal };
