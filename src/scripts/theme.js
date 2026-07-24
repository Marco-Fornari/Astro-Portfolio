/* =========================================================
   THEME — design tokens (HSL) → canvas RGB + light/dark toggle
   ========================================================= */

export const THEME = {
  accent: "#e63b31", accentRGB: "230,59,49",
  hotRGB: "244,140,130", inkRGB: "228,236,243", bgRGB: "13,17,23",
};

function hslTripletToRGB(v, dl = 0) {
  const m = String(v).trim().match(/([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/);
  if (!m) return null;
  const h = +m[1], sN = +m[2] / 100, l = Math.min(1, Math.max(0, +m[3] / 100 + dl));
  const a = sN * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return `${f(0)},${f(8)},${f(4)}`;
}

export function refreshTheme() {
  const cs = getComputedStyle(document.documentElement);
  THEME.accentRGB = hslTripletToRGB(cs.getPropertyValue("--primary")) || THEME.accentRGB;
  THEME.hotRGB    = hslTripletToRGB(cs.getPropertyValue("--primary"), .18) || THEME.hotRGB;
  THEME.inkRGB    = hslTripletToRGB(cs.getPropertyValue("--foreground")) || THEME.inkRGB;
  THEME.bgRGB     = hslTripletToRGB(cs.getPropertyValue("--background")) || THEME.bgRGB;
  THEME.accent    = `rgb(${THEME.accentRGB})`;
}

export const ink = a => `rgba(${THEME.inkRGB},${a})`;
export const acc = a => `rgba(${THEME.accentRGB},${a})`;

export function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("mf-theme"); } catch (e) {}
  if (saved === "dark") document.documentElement.classList.add("dark");
  refreshTheme();
  const btn = document.getElementById("themeBtn");
  if (btn) btn.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("mf-theme", dark ? "dark" : "light"); } catch (e) {}
    refreshTheme();
  });
}
