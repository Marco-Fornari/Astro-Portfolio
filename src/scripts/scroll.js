/* =========================================================
   SCROLL NARRATIVE — active chapter, progress, scroll button
   ========================================================= */
import { reduceMotion, routes } from "./state.js";

let current = "home";
const progressEl = document.getElementById("progress");

/* barra di avanzamento: scaleX sul compositor invece di width (che
   ricalcolava il layout a ogni evento di scroll); al massimo un
   aggiornamento per frame, con l'altezza del documento in cache */
let maxScroll = 1, barRaf = 0;
function measureMax() { maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight); }
function paintBar() {
  barRaf = 0;
  if (progressEl) progressEl.style.transform = `scaleX(${Math.min(1, scrollY / maxScroll)})`;
}
function requestBar() { if (!barRaf) barRaf = requestAnimationFrame(paintBar); }

function setNav(route) {
  document.querySelectorAll("nav a").forEach(a =>
    a.classList.toggle("on", a.dataset.route === route));
  document.body.dataset.route = route;
}

function activate(route) {
  if (route === current) return;
  current = route;
  setNav(route);
  try { history.replaceState(null, "", "#" + route); } catch (e) {}
}

export function initScroll() {
  setNav("home");
  measureMax();
  addEventListener("resize", () => { measureMax(); requestBar(); });
  new ResizeObserver(() => { measureMax(); requestBar(); }).observe(document.querySelector("main"));
  addEventListener("scroll", requestBar, { passive: true });
  requestBar();

  const scrollBtn = document.getElementById("scrollBtn");
  if (scrollBtn) scrollBtn.addEventListener("click", () => {
    const i = routes.indexOf(current);
    if (i >= routes.length - 1) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(routes[i + 1]).scrollIntoView({ behavior: "smooth" });
  });

  /* fires when a section crosses the viewport midline — tall chapters register too */
  const chapterIO = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) activate(en.target.id); });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  routes.forEach(id => {
    const el = document.getElementById(id);
    if (el) chapterIO.observe(el);
  });

  /* deep-link support: open directly on a hash */
  if (location.hash && routes.includes(location.hash.slice(1)) && location.hash !== "#home") {
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "auto" }));
  }
}
