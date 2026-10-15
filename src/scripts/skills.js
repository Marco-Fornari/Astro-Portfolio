/* =========================================================
   SKILLS ZOOM — un clic su un'icona la ingrandisce
   ---------------------------------------------------------
   Un unico pannello (.stk-lens) creato al primo uso e riusato.
   Si apre centrato sull'icona cliccata e la fa "crescere" dalla
   sua posizione (FLIP con Web Animations API: solo transform e
   opacity). Si chiude con un altro clic, Esc, clic fuori, scroll
   o resize. Nome e contesto seguono la lingua attiva.
   ========================================================= */
import { reduceMotion } from "./state.js";

const EDGE = 12;         /* margine minimo dal bordo del viewport */

let lens, lensIco, lensName, lensCtx, current = null, scrollAtOpen = 0;

const lang = () => (document.documentElement.lang === "en" ? "en" : "it");
const ctxOf = btn => btn.dataset[lang() === "en" ? "ctxEn" : "ctxIt"] || "";

function build() {
  lens = document.createElement("div");
  lens.className = "stk-lens";
  lens.setAttribute("aria-hidden", "true");   /* il bottone porta già nome e contesto */
  lens.innerHTML =
    '<div class="stk-lens-bg"></div><div class="stk-lens-ico"></div><p class="stk-lens-name"></p><p class="stk-lens-ctx"></p>';
  lensIco = lens.querySelector(".stk-lens-ico");
  lensName = lens.querySelector(".stk-lens-name");
  lensCtx = lens.querySelector(".stk-lens-ctx");
  document.body.appendChild(lens);
}

function open(btn) {
  if (!lens) build();
  if (current) current.classList.remove("is-zoomed");
  current = btn;
  scrollAtOpen = scrollY;

  const src = btn.querySelector(".stk-ico");
  lensIco.replaceChildren(src.cloneNode(true));
  lensName.textContent = btn.dataset.name;
  lensCtx.textContent = ctxOf(btn);

  /* misura il pannello già impaginato ma invisibile, poi lo posiziona
     con il centro dell'icona grande sopra il centro di quella piccola */
  lens.classList.add("is-open");
  const r = src.getBoundingClientRect();
  const lw = lens.offsetWidth, lh = lens.offsetHeight;
  const icoTop = lensIco.offsetTop, icoSize = lensIco.offsetWidth; /* --stk-lens in CSS */
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let x = cx - lw / 2;
  let y = cy - (icoTop + icoSize / 2);
  x = Math.max(EDGE, Math.min(x, innerWidth - lw - EDGE));
  y = Math.max(EDGE, Math.min(y, innerHeight - lh - EDGE));
  lens.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;

  btn.classList.add("is-zoomed");
  btn.closest(".stk-grid")?.classList.add("is-dim");
  btn.setAttribute("aria-expanded", "true");

  if (reduceMotion) return;
  /* FLIP: l'icona parte dalla posizione/scala di quella cliccata */
  const icoCx = x + lw / 2, icoCy = y + icoTop + icoSize / 2;
  const s = r.width / icoSize;
  lensIco.animate(
    [{ transform: `translate(${cx - icoCx}px,${cy - icoCy}px) scale(${s})` }, { transform: "none" }],
    { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" }
  );
  lens.querySelector(".stk-lens-bg").animate(
    [{ opacity: 0, transform: "scale(.82)" }, { opacity: 1, transform: "none" }],
    { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }
  );
  for (const [i, el] of [lensName, lensCtx].entries()) {
    el.animate(
      [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
      { duration: 280, delay: 120 + i * 50, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }
    );
  }
}

function close() {
  if (!current) return;
  current.classList.remove("is-zoomed");
  current.setAttribute("aria-expanded", "false");
  current.closest(".stk-grid")?.classList.remove("is-dim");
  current = null;
  if (!lens) return;
  if (reduceMotion) { lens.classList.remove("is-open"); return; }
  const anim = lens.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-in" });
  anim.onfinish = () => { if (!current) lens.classList.remove("is-open"); };
}

/* aria-label nella lingua attiva: i18n.js cambia <html lang>, qui lo seguiamo */
function syncLabels() {
  document.querySelectorAll(".stk-btn").forEach(b =>
    b.setAttribute("aria-label", `${b.dataset.name} — ${ctxOf(b)}`));
  if (current) lensCtx.textContent = ctxOf(current);
}

export function initSkills() {
  const section = document.getElementById("skills");
  if (!section) return;

  section.querySelectorAll(".stk-btn").forEach(b => b.setAttribute("aria-expanded", "false"));
  section.addEventListener("click", e => {
    const btn = e.target.closest(".stk-btn");
    if (!btn) return;
    e.stopPropagation();
    btn === current ? close() : open(btn);
  });

  document.addEventListener("click", e => {
    if (current && !e.target.closest(".stk-lens")) close();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && current) { const b = current; close(); b.focus(); }
  });
  addEventListener("scroll", () => {
    if (current && Math.abs(scrollY - scrollAtOpen) > 24) close();
  }, { passive: true });
  addEventListener("resize", close);

  syncLabels();
  new MutationObserver(syncLabels)
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}
