/* =========================================================
   HERO — pinned opening, scroll-driven inspection of layer 2
   ---------------------------------------------------------
   Lavora solo quando serve: un frame viene richiesto da scroll,
   puntatore o resize, e la catena si ferma da sola appena nulla
   cambia più. Niente loop perpetuo, niente letture di layout a
   ogni frame, niente ridisegno del canvas fuori dalla hero.
   ========================================================= */
import { reduceMotion, MONO, view } from "./state.js";
import { ink, acc } from "./theme.js";

let heroProg = 0;
export const getHeroProg = () => heroProg;

const homeSec  = document.getElementById("home");
const sticky   = homeSec.querySelector(".hero-sticky");
const inspector = document.getElementById("inspector");
const heroMedia = document.getElementById("heroMedia");
const heroId   = document.getElementById("heroId");
const heroVeil = document.getElementById("heroVeil");
const scrollBtn = document.getElementById("scrollBtn");
const rc   = document.getElementById("reveal");
const rctx = rc.getContext("2d");
const img2 = new Image();
img2.src = "/hero-2.jpg";
/* horizontal focal point of both portraits — must match object-position in global.css */
const focalX = () => (view.mobile ? 0.80 : 0.62);
const scan = { x:-999, y:-999, tx:-999, ty:-999, on:false, amt:0 };

/* geometria in cache: letta solo al resize, mai durante lo scroll.
   La corsa usa l'altezza CSS dello sticky (100vh) e non innerHeight,
   che sul telefono cambia quando la barra dell'indirizzo entra/esce
   e faceva saltare l'avanzamento. */
const geo = { top: 0, span: 1, end: 0 };
function measure() {
  geo.top  = homeSec.getBoundingClientRect().top + scrollY;
  geo.span = Math.max(1, homeSec.offsetHeight - sticky.offsetHeight);
  geo.end  = geo.top + homeSec.offsetHeight;
}

/* canvas: oltre ~1.5x sul telefono non si guadagna nitidezza
   (hero-2 è 1652 px) ma si paga il riempimento a ogni frame */
let rDPR = 1;
function sizeReveal() {
  const r = inspector.getBoundingClientRect();
  rDPR = view.mobile ? Math.min(view.DPR, 1.5) : view.DPR;
  rc.width = Math.round(r.width * rDPR);
  rc.height = Math.round(r.height * rDPR);
  rctx.setTransform(rDPR, 0, 0, rDPR, 0, 0);
  scanPat = null;
  drawn = -1;
}

/* le scanline (una riga scura ogni 3px) come pattern: un solo
   fillRect al posto di ~300 per frame */
let scanPat = null;
function scanlines() {
  if (scanPat) return scanPat;
  const t = document.createElement("canvas");
  t.width = 1; t.height = 3;
  const c = t.getContext("2d");
  c.fillStyle = "#000"; c.fillRect(0, 0, 1, 1);
  scanPat = rctx.createPattern(t, "repeat");
  return scanPat;
}

/* lente: solo mouse e penna. Sul touch ogni swipe di scroll
   accendeva la lente sotto il dito e teneva vivo il ridisegno. */
const lensable = e => e.pointerType !== "touch";
inspector.addEventListener("pointerenter", e => { if (lensable(e)) { scan.on = true; request(); } });
inspector.addEventListener("pointerleave", e => { if (lensable(e)) { scan.on = false; request(); } });
inspector.addEventListener("pointermove", e => {
  if (!lensable(e)) return;
  scan.on = true;   /* anche se il puntatore era già sopra al caricamento */
  const r = inspector.getBoundingClientRect();
  scan.tx = e.clientX - r.left; scan.ty = e.clientY - r.top;
  request();
}, { passive:true });

let lastP = -1, btnHidden = false;
function updateHero() {
  heroProg = Math.min(1, Math.max(0, (scrollY - geo.top) / geo.span));
  if (heroProg === lastP) return false;
  lastP = heroProg;
  /* the scroll button belongs to the opening only: it dissolves as the hero is left behind */
  if (scrollBtn) {
    const btnA = Math.max(0, 1 - heroProg * 1.9);
    scrollBtn.style.opacity = btnA;
    const hide = btnA < 0.05;
    if (hide !== btnHidden) { btnHidden = hide; scrollBtn.classList.toggle("is-gone", hide); }
  }
  if (reduceMotion) { heroVeil.style.opacity = 0; return true; }
  /* identity recedes, surface zooms, page veil eases the hand-off */
  const p = heroProg;
  /* the type holds through the hand-off to layer 2, then leaves with the veil */
  heroId.style.opacity = Math.max(0, 1 - Math.max(0, p - 0.5) * 2.4);
  heroId.style.transform = `translate3d(0,${-p * 48}px,0) scale(${1 - p * 0.04})`;
  heroMedia.style.transform = `scale(${1 + p * 0.07})`;
  heroVeil.style.opacity = Math.max(0, (p - 0.6) * 1.6);   /* earlier, gentler fade into the flow */
  return true;
}

/* true finché la lente sta ancora animando (serve un altro frame) */
function easeScan() {
  if (scan.x < -500) { scan.x = scan.tx; scan.y = scan.ty; }
  const k = reduceMotion ? 1 : 0.1;
  const target = scan.on ? 1 : 0;
  scan.x += (scan.tx - scan.x) * 0.16;
  scan.y += (scan.ty - scan.y) * 0.16;
  scan.amt += (target - scan.amt) * k;
  if (Math.abs(target - scan.amt) < 0.005) scan.amt = target;
  return scan.amt !== target ||
         (scan.amt > 0 && (Math.abs(scan.tx - scan.x) > 0.3 || Math.abs(scan.ty - scan.y) > 0.3));
}

/* firma dell'ultimo disegno: se avanzamento e lente non sono cambiati
   il canvas è già giusto e non si ridisegna */
let drawn = -1;
function drawReveal() {
  if (!img2.complete || !rc.width) return;
  const sig = scan.amt > 0 ? `${heroProg}|${scan.amt}|${scan.x}|${scan.y}` : heroProg;
  if (sig === drawn) return;
  drawn = sig;
  const w = rc.width / rDPR, h = rc.height / rDPR;

  rctx.clearRect(0, 0, w, h);

  const iw = img2.naturalWidth, ih = img2.naturalHeight;
  const sc = Math.max(w / iw, h / ih);
  const dw = iw * sc, dh = ih * sc;
  const dx = (w - dw) * focalX(), dy = (h - dh) / 2;
  const drawImg2 = () => rctx.drawImage(img2, dx, dy, dw, dh);

  /* 1 — scroll-driven scan: the analysis layer wipes down as the story advances */
  const edge = heroProg * (h + 6);
  if (edge > 0.5) {
    rctx.save();
    rctx.beginPath(); rctx.rect(0, 0, w, edge); rctx.clip();
    rctx.globalAlpha = 0.96;
    drawImg2();
    rctx.globalAlpha = 0.14;
    rctx.fillStyle = scanlines();
    rctx.fillRect(0, 0, w, edge);
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
    rctx.fillStyle = scanlines();
    rctx.fillRect(0, 0, w, h);
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

/* ---------- scheduler: un frame solo quando qualcosa è cambiato ---------- */
let rafId = 0;
function frame() {
  rafId = 0;
  updateHero();
  /* la hero è fuori schermo: niente canvas finché non si torna su */
  if (scrollY > geo.end) return;
  const lensMoving = easeScan();
  drawReveal();
  if (lensMoving) request();
}
function request() { if (!rafId) rafId = requestAnimationFrame(frame); }

/* ---------- public API ---------- */
export function initHero() {
  measure();
  sizeReveal();
  new ResizeObserver(() => { measure(); sizeReveal(); request(); }).observe(homeSec);
  new ResizeObserver(() => { sizeReveal(); request(); }).observe(inspector);
  addEventListener("scroll", request, { passive: true });
  if (!img2.complete) img2.addEventListener("load", () => { drawn = -1; request(); }, { once: true });
  request();
}
export { sizeReveal };
