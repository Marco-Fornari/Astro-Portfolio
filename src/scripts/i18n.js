/* =========================================================
   I18N — apply translations + language toggle
   ========================================================= */
import { I18N, NAV_I18N } from "../i18n/dictionary.js";

function applyLang(lang) {
  if (!I18N[lang]) lang = "it";
  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll("nav a[data-route]").forEach(a => {
    const lbl = NAV_I18N[lang][a.dataset.route];
    if (lbl) a.textContent = lbl;
  });
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang button").forEach(b =>
    b.classList.toggle("on", b.dataset.lang === lang));
  try { localStorage.setItem("mf-lang", lang); } catch (e) {}
}
export function initLang() {
  let saved = null;
  try { saved = localStorage.getItem("mf-lang"); } catch (e) {}
  const lang = saved || ((navigator.language || "it").toLowerCase().startsWith("en") ? "en" : "it");
  document.querySelectorAll(".lang button").forEach(b =>
    b.addEventListener("click", () => applyLang(b.dataset.lang)));
  applyLang(lang);
}
