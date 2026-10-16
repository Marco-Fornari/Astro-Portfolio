/* =========================================================
   HERO — pinned opening, scroll-driven inspection of layer 2
   ---------------------------------------------------------
   Lo scan guidato dallo scroll è fatto di livelli DOM mossi solo
   con transform (#heroScan / #heroScanIn): il compositor li sposta
   senza ridisegnare nulla, quindi lo swipe sul telefono resta
   fluido. Prima era un canvas a tutto schermo ridisegnato a ogni
   frame (drawImage scalato + clip + scanline): era lui a bloccare.

   Il canvas resta solo per la lente del puntatore, e solo dove c'è
   un mouse/trackpad: sul touch non viene nemmeno dimensionato.
   ========================================================= */
import { reduceMotion, view } from "./state.js";
import { ink, acc } from "./theme.js";

let heroProg = 0;
export const getHeroProg = () => heroProg;

const homeSec   = document.getElementById("home");
const sticky    = homeSec.querySelector(".hero-sticky");
const inspector = document.getElementById("inspector");
const heroMedia = document.getElementById("heroMedia");
const heroId    = document.getElementById("heroId");
const heroVeil  = document.getElementById("heroVeil");
const scrollBtn = document.getElementById("scrollBtn");
const scanEl    = document.getElementById("heroScan");
const scanIn    = document.getElementById("heroScanIn");
const scanPct   = document.getElementById("heroScanPct");
const img2      = document.getElementById("imgScan");   /* anche sorgente della lente */
const rc        = document.getElementById("reveal");

/* lente solo con un puntatore fine che può stare "sopra" all'immagine */
const canLens = matchMedia("(hover:hover) and (pointer:fine)").matches;
const rctx = canLens ? rc.getContext("2d") : null;
if (!canLens) rc.remove();

/* horizontal focal point of both portraits — must match object-position in global.css */
const focalX = () => (view.mobile ? 0.80 : 0.62);
const scan = { x:-999, y:-999, tx:-999, ty:-999, on:false, amt:0 };

/* geometria in cache: letta solo al resize, mai durante lo scroll.
   La corsa usa l'altezza CSS dello sticky (100vh) e non innerHeight,
   che sul telefono cambia quando la barra dell'indirizzo entra/esce. */
const geo = { top: 0, span: 1, end: 0 };
function measure() {
  geo.top  = homeSec.getBoundingClientRect().top + scrollY;
  geo.span = Math.max(1, homeSec.offsetHeight - sticky.offsetHeight);
  geo.end  = geo.top + homeSec.offsetHeight;
}

/* ---------- lente (solo desktop) ---------- */
let rDPR = 1, lensDrawn = false;
function sizeReveal() {
  if (!rctx) return;
  const r = inspector.getBoundingClientRect();
  rDPR = view.DPR;
  rc.width = Math.round(r.width * rDPR);
  rc.height = Math.round(r.height * rDPR);
  rctx.setTransform(rDPR, 0, 0, rDPR, 0, 0);
  scanPat = null;
  lensDrawn = true;          /* il resize svuota il canvas: ridisegna al prossimo frame */
}

/* le scanline (una riga scura ogni 3px) come pattern: un solo fillRect */
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

if (rctx) {
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

function drawLens() {
  if (!rctx || !rc.width) return;
  const w = rc.width / rDPR, h = rc.height / rDPR;
  if (scan.amt <= 0.01 || !img2.complete || !img2.naturalWidth) {
    if (lensDrawn) { rctx.clearRect(0, 0, w, h); lensDrawn = false; }
    return;
  }
  lensDrawn = true;
  rctx.clearRect(0, 0, w, h);

  const iw = img2.naturalWidth, ih = img2.naturalHeight;
  const sc = Math.max(w / iw, h / ih);
  const dw = iw * sc, dh = ih * sc;
  const dx = (w - dw) * focalX(), dy = (h - dh) / 2;

  const R0 = Math.min(w, h) * 0.28 * scan.amt;
  const bandH = 70 * scan.amt;
  rctx.save();
  rctx.beginPath();
  rctx.arc(scan.x, scan.y, R0, 0, Math.PI * 2);
  rctx.rect(0, scan.y - bandH / 2, w, bandH);
  rctx.clip();
  rctx.globalAlpha = scan.amt;
  rctx.drawImage(img2, dx, dy, dw, dh);
  rctx.globalAlpha = 0.16 * scan.amt;
  rctx.fillStyle = scanlines();
  rctx.fillRect(0, 0, w, h);
  rctx.restore();

  rctx.globalAlpha = scan.amt;
  rctx.lineWidth = 1;
  rctx.strokeStyle = ink(0.75);
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

/* ---------- avanzamento della hero: solo transform e opacity ---------- */
let lastP = -1, btnHidden = false, lastPct = -1, scanDone = null;
function updateHero() {
  heroProg = Math.min(1, Math.max(0, (scrollY - geo.top) / geo.span));
  if (heroProg === lastP) return;
  lastP = heroProg;
  const p = heroProg;

  /* the scroll button belongs to the opening only: it dissolves as the hero is left behind */
  if (scrollBtn) {
    const btnA = Math.max(0, 1 - p * 1.9);
    scrollBtn.style.opacity = btnA;
    const hide = btnA < 0.05;
    if (hide !== btnHidden) { btnHidden = hide; scrollBtn.classList.toggle("is-gone", hide); }
  }

  /* 1 — scan di analisi: il livello 2 si scopre dall'alto man mano che si scende */
  scanEl.style.transform = `translate3d(0,${((p - 1) * 100).toFixed(3)}%,0)`;
  scanIn.style.transform = `translate3d(0,${((1 - p) * 100).toFixed(3)}%,0)`;
  const pct = Math.round(p * 100);
  if (pct !== lastPct) { lastPct = pct; scanPct.textContent = `ANALYSIS ${String(pct).padStart(3, "0")}%`; }
  const done = p > 0.995;
  if (done !== scanDone) { scanDone = done; scanEl.classList.toggle("is-done", done); }

  if (reduceMotion) { heroVeil.style.opacity = 0; return; }
  /* identity recedes, surface zooms, page veil eases the hand-off.
     Sul telefono il titolo non scala: con il suo text-shadow ampio
     costringerebbe a riraster ogni frame (Safari in particolare). */
  heroId.style.opacity = Math.max(0, 1 - Math.max(0, p - 0.5) * 2.4);
  heroId.style.transform = view.mobile
    ? `translate3d(0,${-p * 48}px,0)`
    : `translate3d(0,${-p * 48}px,0) scale(${1 - p * 0.04})`;
  /* sul telefono la superficie non zooma: riscalare a ogni frame due
     foto a tutto schermo invalida l'intero frame (Firefox lo ricompone
     da capo e scatta), per un 7% che su uno schermo piccolo non si nota */
  heroMedia.style.transform = view.mobile ? "" : `scale(${1 + p * 0.07})`;
  heroVeil.style.opacity = Math.max(0, (p - 0.6) * 1.6);   /* earlier, gentler fade into the flow */
}

/* ---------- scheduler: un frame solo quando qualcosa è cambiato ---------- */
let rafId = 0;
function frame() {
  rafId = 0;
  updateHero();
  if (!rctx || scrollY > geo.end) return;   /* niente lente fuori dalla hero */
  const lensMoving = easeScan();
  drawLens();
  if (lensMoving) request();
}
function request() { if (!rafId) rafId = requestAnimationFrame(frame); }

/* nelle sezioni interne la hero è già chiusa (p = 1) e fuori schermo:
   lo scroll non chiede più frame qui, il thread resta libero */
function onScroll() {
  if (lastP === 1 && scrollY > geo.end) return;
  request();
}

/* ---------- public API ---------- */
export function initHero() {
  measure();
  sizeReveal();
  new ResizeObserver(() => { measure(); lastP = -1; request(); }).observe(homeSec);
  if (rctx) new ResizeObserver(() => { sizeReveal(); request(); }).observe(inspector);
  addEventListener("scroll", onScroll, { passive: true });
  request();
}
export { sizeReveal };
