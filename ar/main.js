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

/* AMBIL MODEL DARI URL */
const params = new URLSearchParams(window.location.search);
const model  = params.get('model');

/* LOAD MODEL */
if (!model) {
  overlay.innerHTML = "<h2 style='color:white'>Model tidak ditemukan</h2>";
} else {
  // Path disesuaikan dengan struktur GitHub Pages:
  // https://aryamdhka06.github.io/arloka/models/...
  viewer.src = '/arloka/models/' + model;

  viewer.addEventListener('load', () => {
    setTimeout(() => overlay.classList.add('hidden'), 500);
  });

  viewer.addEventListener('error', () => {
    overlay.innerHTML = "<h2 style='color:red'>Gagal load model</h2>";
  });
}

/* CAMERA DEFAULT */
const DEFAULT_ORBIT = '0deg 65deg 3.5m';
const DEFAULT_FOV   = '35deg';

/* AR SCALE */
let arScalePct = 15;
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

/* LOADING PROGRESS */
viewer.addEventListener('progress', (e) => {
  fill.style.width = (e.detail.totalProgress * 100) + '%';
});

/* AR */
arTrigger.addEventListener('click', () => {
  viewer.activateAR();
});

/* RESET */
btnReset.addEventListener('click', () => {
  viewer.cameraOrbit = DEFAULT_ORBIT;
  viewer.fieldOfView = DEFAULT_FOV;
  viewer.resetTurntableRotation();
});

/* ROTATE TOGGLE */
let rotating = true;
btnRotate.addEventListener('click', () => {
  rotating = !rotating;
  viewer.autoRotate = rotating;
  btnRotate.textContent = rotating ? 'Pause' : 'Play';
});

/* ZOOM */
btnZoomIn.addEventListener('click', () => {
  const orb  = viewer.getCameraOrbit();
  const newR = Math.max(1.5, orb.radius * 0.75);
  viewer.cameraOrbit = `${orb.theta}rad ${orb.phi}rad ${newR}m`;
});

btnZoomOut.addEventListener('click', () => {
  const orb  = viewer.getCameraOrbit();
  const newR = Math.min(50, orb.radius * 1.3);
  viewer.cameraOrbit = `${orb.theta}rad ${orb.phi}rad ${newR}m`;
});