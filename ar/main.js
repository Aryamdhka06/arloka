/* ═══════════════════════════════════════════════
   main.js — Rumah Adat Kajang Lako (Jambi)
   ═══════════════════════════════════════════════ */

const viewer       = document.getElementById('viewer');
const overlay      = document.getElementById('loading-overlay');
const fill         = document.getElementById('progress-fill');
const btnReset     = document.getElementById('btn-reset');
const btnRotate    = document.getElementById('btn-rotate');
const btnZoomIn    = document.getElementById('btn-zoomin');
const btnZoomOut   = document.getElementById('btn-zoomout');
const arTrigger    = document.getElementById('ar-trigger');
const arScalePanel = document.getElementById('ar-scale-panel');
const arScaleUp    = document.getElementById('ar-scale-up');
const arScaleDown  = document.getElementById('ar-scale-down');
const arScaleVal   = document.getElementById('ar-scale-val');

/* ── KAMERA DEFAULT ───────────────────────────── */
/* Sinkron dengan camera-orbit di HTML */
const DEFAULT_ORBIT = '0deg 65deg 12m';
const DEFAULT_FOV   = '45deg';

/* ── ICON SVG ─────────────────────────────────── */
const ICON_PLAY  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const ICON_PAUSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

/* ─────────────────────────────────────────────────
   SKALA AR
   ar-scale="auto" → user bisa pinch di AR
   Tombol +/− mengubah scale awal sebelum AR dibuka
   Mulai dari 15% (sinkron dengan scale="0.15" di HTML)
   Step: 1% per klik, range: 1% – 50%
──────────────────────────────────────────────────── */
let arScalePct = 15;  // sinkron dengan scale="0.15 0.15 0.15" di HTML
const AR_STEP  = 1;
const AR_MIN   = 1;
const AR_MAX   = 50;

function applyARScale() {
  const s = (arScalePct / 100).toFixed(3);
  viewer.setAttribute('scale', `${s} ${s} ${s}`);
  arScaleVal.textContent = arScalePct + '%';
}

arScaleUp.addEventListener('click', () => {
  arScalePct = Math.min(AR_MAX, arScalePct + AR_STEP);
  applyARScale();
});

arScaleDown.addEventListener('click', () => {
  arScalePct = Math.max(AR_MIN, arScalePct - AR_STEP);
  applyARScale();
});

/* ── LOADING PROGRESS ─────────────────────────── */
viewer.addEventListener('progress', (e) => {
  fill.style.width = (e.detail.totalProgress * 100) + '%';
});

viewer.addEventListener('load', () => {
  setTimeout(() => overlay.classList.add('hidden'), 600);
  /* Sembunyikan tombol AR kalau device tidak support */
  if (!viewer.canActivateAR) {
    arTrigger.classList.add('hidden');
  }
});

/* ── TOMBOL AR ────────────────────────────────── */
arTrigger.addEventListener('click', () => {
  viewer.activateAR();
});

/* ── TAMPILKAN / SEMBUNYIKAN PANEL SKALA ─────── */
viewer.addEventListener('ar-status', (e) => {
  if (e.detail.status === 'session-started') {
    arScalePanel.classList.add('visible');
  } else {
    arScalePanel.classList.remove('visible');
  }
});

/* ── RESET KAMERA ─────────────────────────────── */
btnReset.addEventListener('click', () => {
  viewer.cameraOrbit = DEFAULT_ORBIT;
  viewer.fieldOfView = DEFAULT_FOV;
  viewer.resetTurntableRotation();
});

/* ── AUTO-ROTATE TOGGLE ───────────────────────── */
let rotating = true;
btnRotate.innerHTML = ICON_PAUSE;
btnRotate.classList.add('active');

btnRotate.addEventListener('click', () => {
  rotating = !rotating;
  viewer.autoRotate = rotating;
  btnRotate.innerHTML = rotating ? ICON_PAUSE : ICON_PLAY;
  rotating
    ? btnRotate.classList.add('active')
    : btnRotate.classList.remove('active');
});

/* ── ZOOM IN / OUT (mode 3D web viewer) ─────── */
btnZoomIn.addEventListener('click', () => {
  const orb  = viewer.getCameraOrbit();
  const newR = Math.max(5, orb.radius * 0.75);
  viewer.cameraOrbit = `${orb.theta}rad ${orb.phi}rad ${newR}m`;
});

btnZoomOut.addEventListener('click', () => {
  const orb  = viewer.getCameraOrbit();
  const newR = Math.min(50, orb.radius * 1.35);
  viewer.cameraOrbit = `${orb.theta}rad ${orb.phi}rad ${newR}m`;
});