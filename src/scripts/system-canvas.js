/* =========================================================
   SYSTEM CANVAS — verlet physics used purely as a page transition
   ========================================================= */
import { reduceMotion, MONO, view, ptr } from "./state.js";
import { THEME, ink, acc } from "./theme.js";

let cv, ctx;

let currentRoute = "home";
export function setSceneRoute(route) { currentRoute = route; }

/* ---------- physics ---------- */
let nodes = [], springs = [], pulses = [];
let sceneShift = 0, shiftTarget = 0, shiftVel = 0;
let sweeping = false, sweepFrom = 0, sceneAlpha = 0;
let pulseTimer = 0;

function makeNode(hx, hy, o = {}) {
  return Object.assign({
    x:hx, y:hy, px:hx, py:hy, hx, hy,
    r:o.kind === "module" ? 4 : 2.5,
    kind:"tag", label:"", hot:false, mass:1,
  }, o);
}
function link(a, b, o = {}) {
  springs.push(Object.assign({ a, b, len:Math.hypot(a.hx-b.hx, a.hy-b.hy), k:0.06, faint:false }, o));
}

function buildScene(route, dir) {
  nodes = []; springs = []; pulses = [];
  ({ home:homeLayout, about:aboutLayout, experience:xpLayout, contact:contactLayout }[route] || homeLayout)();
  if (dir === 0 || reduceMotion) {          /* idle: the stage stays empty, content owns the page */
    sweeping = false; sceneAlpha = 0;
    sceneShift = 0; shiftTarget = 0; shiftVel = 0;
    nodes.forEach(n => { n.x = n.hx; n.px = n.x; n.y = n.hy; n.py = n.y; });
    return;
  }
  /* transition: the structure crosses the screen horizontally and leaves */
  const enterOff = dir * (view.W * 1.05 || 1000);
  nodes.forEach((n, i) => {
    const stag = 1 + ((i * 7) % 13) * 0.03;
    n.x = n.hx + enterOff * stag; n.px = n.x;
    n.y = n.hy; n.py = n.y;                  /* strictly horizontal development */
  });
  sceneShift = enterOff;
  shiftTarget = -enterOff;                   /* glide through centre, exit the far side */
  sweepFrom = enterOff;
  shiftVel = 0; sweeping = true; sceneAlpha = 0;
}

function homeLayout() { /* the hero is the image surface itself */ }

function aboutLayout() {
  const cx = view.mobile ? view.W * 0.5 : view.W * 0.72;
  const cy = view.mobile ? view.H * 0.78 : view.H * 0.5;
  const marco = makeNode(cx, cy, { kind:"module", label:"MARCO", hot:true });
  nodes.push(marco);
  const dev = ["C#",".NET","API","SQL","FLUTTER","GIT"];
  const sec = ["PHISHING","THREAT","RISK","DLP","APPSEC"];
  const ring = (list, r0, off, hot) => list.forEach((lb, i) => {
    if (view.mobile && i > 3) return;
    const a = off + (i / list.length) * Math.PI * 2;
    const n = makeNode(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.72, { label:lb, hot });
    nodes.push(n); link(marco, n, { faint:!hot, k:0.045 });
  });
  ring(dev, view.mobile ? 96 : 150, 0.4, false);
  ring(sec, view.mobile ? 150 : 235, 1.1, true);
  const outer = nodes.filter(n => n.hot && n !== marco);
  for (let i = 0; i < outer.length; i++) link(outer[i], outer[(i + 1) % outer.length], { faint:true, k:0.02 });
}

function xpLayout() {
  const xL = view.mobile ? view.W * 0.85 : view.W * 0.16;
  const t = view.H * 0.24, b = view.H * 0.84;
  const a = makeNode(xL, t, { kind:"module", label:"2022 · STORY" });
  const bN = makeNode(xL + (view.mobile ? -20 : 50), (t + b) / 2, { kind:"module", label:"2025 · CODE" });
  const c = makeNode(xL, b, { kind:"module", label:"2026 · SECURITY", hot:true });
  nodes.push(a, bN, c); link(a, bN); link(bN, c);
  if (!view.mobile) {
    const s = (host, lb, dx, dy) => { const n = makeNode(host.hx + dx, host.hy + dy, { label:lb }); nodes.push(n); link(host, n, { faint:true, k:.05 }); };
    s(a,"VISUAL",-70,-46); s(a,"CLIENTS",90,-30);
    s(bN,"WEB",-80,-34); s(bN,"PHP",-60,52); s(bN,"MYSQL",95,-14);
    s(c,"OVERGUARD",100,-36); s(c,"BEC",-70,-50); s(c,"PHISHING",80,40);
  }
}

function contactLayout() {
  const y = view.mobile ? view.H * 0.85 : view.H * 0.8;
  const x0 = view.W * (view.mobile ? 0.12 : 0.16), x1 = view.W * (view.mobile ? 0.88 : 0.86);
  const marco = makeNode(x0, y, { kind:"module", label:"MARCO", hot:true });
  const you   = makeNode(x1, y, { kind:"module", label:"YOU",   hot:true });
  nodes.push(marco, you);
  const N = view.mobile ? 8 : 14;
  let prev = marco;
  for (let i = 1; i < N; i++) {
    const n = makeNode(x0 + (x1 - x0) * (i / N), y + Math.sin(i * 1.2) * 6, { label:"", r:1.8 });
    n.kind = "bead"; nodes.push(n); link(prev, n, { k:0.09 }); prev = n;
  }
  link(prev, you, { k:0.09 });
}

/* ---------- simulation ---------- */
function step() {
  if (!sweeping && sceneAlpha <= 0.01) return;   /* nothing on stage while reading */
  const dz = shiftTarget - sceneShift;
  shiftVel = shiftVel * 0.945 + dz * 0.02;   /* long, quiet glide between chapters */
  sceneShift += shiftVel;
  if (sweeping) {
    const p = Math.min(1, Math.max(0, (sweepFrom - sceneShift) / (sweepFrom - shiftTarget || 1)));
    sceneAlpha = Math.sin(Math.PI * p) * 0.9;    /* fades in, peaks mid-crossing, fades out */
    if (Math.abs(dz) < 2 && Math.abs(shiftVel) < 0.6) { sweeping = false; sceneAlpha = 0; }
  }

  const damp = reduceMotion ? 0.6 : 0.9;
  const homeK = reduceMotion ? 0.4 : 0.02;
  const speedF = 1 + ptr.speed / 18;
  const R = view.mobile ? 90 : 130;

  for (const n of nodes) {
    const tx = n.hx + sceneShift;
    let vx = (n.x - n.px) * damp, vy = (n.y - n.py) * damp;
    n.px = n.x; n.py = n.y;
    vx += (tx - n.x) * homeK;
    vy += (n.hy - n.y) * homeK;
    if (!reduceMotion) {
      const dx = n.x - ptr.x, dy = n.y - ptr.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = ((R - d) / R) ** 2 * 2.2 * speedF / n.mass;
        vx += (dx / d) * f; vy += (dy / d) * f;
      }
    }
    n.x += vx; n.y += vy;
  }

  if (!reduceMotion) for (let it = 0; it < 2; it++) {
    for (const s of springs) {
      const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const diff = (d - s.len) / d * s.k;
      const ax = dx * diff, ay = dy * diff;
      s.a.x += ax; s.a.y += ay;
      s.b.x -= ax; s.b.y -= ay;
    }
  }

  if (!reduceMotion && sweeping) {
    pulseTimer -= 1;
    if (pulseTimer <= 0 && springs.length) {
      const eligible = springs.filter(sp => !sp.faint);
      const sp = (eligible.length ? eligible : springs)[Math.floor(Math.random() * (eligible.length || springs.length))];
      pulses.push({ s:sp, t:0, sp:0.02 + Math.random() * 0.015 });
      pulseTimer = 10 + Math.random() * 16;
    }
  }
  for (let i = pulses.length - 1; i >= 0; i--) {
    pulses[i].t += pulses[i].sp;
    if (pulses[i].t >= 1) pulses.splice(i, 1);
  }
}

/* ---------- render ---------- */
function draw() {
  ctx.clearRect(0, 0, view.W, view.H);
  if (sceneAlpha <= 0.01) return;            /* the stage is empty outside transitions */
  ctx.lineWidth = 1;
  ctx.globalAlpha = sceneAlpha;

  for (const s of springs) {
    ctx.strokeStyle = s.faint ? ink(0.10) : ink(0.22);
    ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke();
  }
  ctx.fillStyle = THEME.accent;
  for (const p of pulses) {
    const x = p.s.a.x + (p.s.b.x - p.s.a.x) * p.t;
    const y = p.s.a.y + (p.s.b.y - p.s.a.y) * p.t;
    ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
  }
  ctx.textBaseline = "middle";
  for (const n of nodes) {
    if (n.kind === "module") {
      ctx.font = `10px ${MONO}`;
      const tw = ctx.measureText(n.label).width;
      const w = tw + 26, h = 26;
      ctx.fillStyle = `rgba(${THEME.bgRGB},0.85)`;
      ctx.fillRect(n.x - w / 2, n.y - h / 2, w, h);
      ctx.strokeStyle = n.hot ? acc(0.75) : ink(0.4);
      ctx.strokeRect(n.x - w / 2 + .5, n.y - h / 2 + .5, w - 1, h - 1);
      ctx.fillStyle = n.hot ? `rgb(${THEME.hotRGB})` : ink(0.85);
      ctx.fillText(n.label, n.x - tw / 2 + 4, n.y + 0.5);
      ctx.fillStyle = n.hot ? THEME.accent : ink(0.5);
      ctx.beginPath(); ctx.arc(n.x - w / 2 + 8, n.y, 2, 0, 7); ctx.fill();
    } else if (n.kind === "bead") {
      ctx.fillStyle = ink(0.55);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 7); ctx.fill();
    } else {
      ctx.fillStyle = n.hot ? THEME.accent : ink(0.45);
      ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, 7); ctx.fill();
      ctx.font = `9px ${MONO}`;
      ctx.fillStyle = n.hot ? `rgba(${THEME.hotRGB},0.95)` : ink(0.55);
      ctx.fillText(n.label, n.x + 7, n.y + 0.5);
    }
  }
  ctx.globalAlpha = 1;
}

/* ---------- public API ---------- */
export function initSystemCanvas() {
  cv = document.getElementById("system");
  ctx = cv.getContext("2d");
  resizeCanvas();
  addEventListener("resize", resizeCanvas);
}

export function resizeCanvas() {
  view.DPR = Math.min(devicePixelRatio || 1, 2);
  view.W = innerWidth; view.H = innerHeight;
  view.mobile = view.W < 700;
  cv.width = view.W * view.DPR; cv.height = view.H * view.DPR;
  ctx.setTransform(view.DPR, 0, 0, view.DPR, 0, 0);
  buildScene(currentRoute, 0);
}


/* one animation frame of the transition layer */
export function frameSystem() { step(); draw(); }

export { buildScene };
