/* =========================================================
   SCROLL NARRATIVE — active chapter, progress, scroll button
   ========================================================= */
import { reduceMotion, routes } from "./state.js";
import { buildScene, setSceneRoute } from "./system-canvas.js";

let current = "home";
let lastY = scrollY, scrollDir = 1;
const progressEl = document.getElementById("progress");

addEventListener("scroll", () => {
  scrollDir = scrollY > lastY ? 1 : -1;
  lastY = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progressEl) progressEl.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
}, { passive: true });

function setNav(route) {
  document.querySelectorAll("nav a").forEach(a =>
    a.classList.toggle("on", a.dataset.route === route));
  document.body.dataset.route = route;
}

function activate(route) {
  if (route === current) return;
  current = route;
  setNav(route);
  setSceneRoute(route);
  buildScene(route, reduceMotion ? 0 : scrollDir);
  try { history.replaceState(null, "", "#" + route); } catch (e) {}
}

export function initScroll() {
  setNav("home");

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
