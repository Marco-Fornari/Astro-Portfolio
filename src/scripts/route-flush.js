/* =========================================================
   ROUTE FLUSH — transizione di rotta "svuotamento del buffer"
   ---------------------------------------------------------
   Click sul menu →
     1. FLUSH  : la riga della sezione in uscita cade, carattere
                 per carattere, con un piccolo stagger (ordinato,
                 come un buffer di log che si svuota).
     2. TICK   : il contatore di sezione avanza (01 → 02) e resta
                 come elemento di continuità visiva.
     3. REBUILD: la riga della sezione in entrata si ricostruisce
                 da sinistra a destra (reveal orizzontale, niente
                 cursore lampeggiante).
   Il salto di scroll è istantaneo e avviene dietro al velo, così
   si evita lo smooth-scroll attraverso le copertine pinnate.

   Tutte le durate e le curve vivono nelle variabili --rf-* in
   global.css: questo modulo le legge, non le duplica.
   ========================================================= */
import { reduceMotion, routes } from "./state.js";

const MOBILE_Q = "(max-width:699px)";

let el = null;        /* riferimenti DOM dell'overlay, creati al primo uso */
let running = false;
/* rotta corrente secondo QUESTO modulo: non dipende dall'IntersectionObserver
   di scroll.js, che aggiorna body.dataset.route solo dopo il salto */
let here = null;
let timers = [];

/* ---------- utility ---------- */

/* legge una variabile CSS temporale (--rf-jump: 430ms) in millisecondi */
function ms(cs, name, fallback) {
  const v = cs.getPropertyValue(name).trim();
  const n = parseFloat(v);
  if (!v || Number.isNaN(n)) return fallback;
  return v.endsWith("ms") ? n : n * 1000;
}

function at(fn, delay) { timers.push(setTimeout(fn, delay)); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }

/* "01" per about, "02" per experience… coerente con i kicker delle sezioni */
function numOf(route) {
  const i = routes.indexOf(route);
  return String(i < 0 ? 0 : i).padStart(2, "0");
}

/* etichetta della rotta: il kicker reale della sezione (già tradotto da
   i18n.js), altrimenti "00 / HOME" ricavato dal link di menu */
function labelOf(route) {
  const sec = document.getElementById(route);
  const k = sec && sec.querySelector(".kicker");
  if (k && k.textContent.trim()) return k.textContent.replace(/\s+/g, " ").trim();
  const a = document.querySelector(`nav a[data-route="${route}"]`);
  return `${numOf(route)} / ${(a ? a.textContent : route).toUpperCase()}`;
}

/* scrive il testo in una riga: split per carattere (effetto pieno) oppure
   in blocco unico (mobile / reduced-motion) */
function write(node, text, simple) {
  node.textContent = "";
  if (simple) { node.textContent = text; return; }
  const frag = document.createDocumentFragment();
  let i = 0;
  for (const ch of text) {
    const s = document.createElement("span");
    s.className = "c";
    s.style.setProperty("--i", i++);
    s.textContent = ch === " " ? " " : ch;
    frag.appendChild(s);
  }
  node.appendChild(frag);
}

/* ---------- overlay ---------- */

function ui() {
  if (el) return el;
  const root = document.createElement("div");
  root.id = "routeFlush";
  root.className = "rf";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML =
    '<div class="rf-inner">' +
      '<p class="rf-line rf-out mono"><span class="rf-t"></span></p>' +
      '<p class="rf-counter mono">' +
        '<span class="rf-from"></span>' +
        '<span class="rf-arrow">&#8594;</span>' +
        '<span class="rf-to"></span>' +
      '</p>' +
      '<p class="rf-line rf-in mono"><span class="rf-t"></span></p>' +
    '</div>';
  document.body.appendChild(root);
  el = {
    root,
    out:  root.querySelector(".rf-out .rf-t"),
    into: root.querySelector(".rf-in .rf-t"),
    from: root.querySelector(".rf-from"),
    to:   root.querySelector(".rf-to")
  };
  return el;
}

/* ---------- sequenza ---------- */

function go(fromRoute, toRoute, target) {
  const u = ui();
  const cs = getComputedStyle(document.documentElement);
  const reduced = reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const simple  = reduced || matchMedia(MOBILE_Q).matches;

  /* orchestrazione: leggibile e regolabile dal CSS */
  const T = reduced
    ? { jump: 90,  rebuild: 90,  hold: 140 }
    : {
        jump:    ms(cs, "--rf-jump",   430),
        rebuild: ms(cs, "--rf-in-at",  430),
        hold:    ms(cs, "--rf-hold",   430)
      };
  const veilOut = reduced ? 160 : ms(cs, "--rf-veil-out", 300);

  running = true;

  u.root.classList.toggle("is-simple", simple);
  u.root.classList.remove("is-in");
  write(u.out,  labelOf(fromRoute), simple);
  write(u.into, labelOf(toRoute),   simple);
  u.from.textContent = numOf(fromRoute);
  u.to.textContent   = numOf(toRoute);

  void u.root.offsetWidth;            /* forza il reflow: le transizioni partono */
  u.root.classList.add("is-open");    /* 1. velo + FLUSH della riga in uscita */

  at(() => {                          /* salto istantaneo, nascosto dal velo */
    /* "instant": con behavior "auto" erediterebbe scroll-behavior:smooth dal CSS */
    target.scrollIntoView({ behavior: "instant", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, T.jump);

  at(() => u.root.classList.add("is-in"), T.rebuild);   /* 2. tick + 3. REBUILD */

  at(() => u.root.classList.remove("is-open"), T.rebuild + T.hold);

  at(() => {
    u.root.classList.remove("is-in", "is-simple");
    write(u.out, "", true); write(u.into, "", true);
    running = false;
  }, T.rebuild + T.hold + veilOut);
}

/* ---------- init ---------- */

export function initRouteFlush() {
  const links = document.querySelectorAll('nav a[data-route][href^="#"]');
  if (!links.length) return;

  links.forEach(a => a.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const to = a.dataset.route;
    const target = document.getElementById(to);
    if (!target) return;
    e.preventDefault();
    if (running) return;                          /* transizione già in corso */
    const from = here || document.body.dataset.route || "home";
    if (from === to) {                            /* stessa sezione: solo scroll */
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      return;
    }
    here = to;
    go(from, to, target);
  }));

  addEventListener("pagehide", () => { clearTimers(); running = false; });
}
