// ─── CONFIGURACIÓN EMAILJS ───────────────────────────────────────────────────
// Para habilitar el envío de correos automáticos:
//  1. Crea una cuenta en https://emailjs.com (es gratis hasta 200 correos/mes)
//  2. Crea un Service y un Template
//  3. Reemplaza los valores de abajo con los tuyos y descomenta initEmailJS()
const EMAILJS_CONFIG = {
  publicKey:  '',   // Tu Public Key de EmailJS
  serviceId:  '',   // Tu Service ID  (ej. 'service_abc123')
  templateId: '',   // Tu Template ID (ej. 'template_xyz789')
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const STORAGE_KEY      = 'cbtis106_test_responses';
const PERSONAL_DATA_KEY = 'cbtis106_personal_data';
const RECORDS_KEY      = 'cbtis106_registros';
const LAST_RESULT_KEY  = 'cbtis106_last_result';
const MAX_RECORDS      = 50;   // Máximo de registros guardados en localStorage
const QUESTIONS_PER_AREA = 15; // Preguntas por especialidad
const MAX_VALUE_PER_Q  = 5;    // Valor máximo por pregunta (escala 1–5)
const MAX_SCORE        = QUESTIONS_PER_AREA * MAX_VALUE_PER_Q; // 75

// ─── DEFINICIÓN DE CATEGORÍAS (fuente única de verdad) ───────────────────────
// Cada objeto contiene la clave del JSON, el emoji y el nombre a mostrar.
// El orden aquí debe coincidir con el orden de preguntas en preguntas.json.
const categorias = [
  { key: 'Dietetica',                         emoji: '🥗', nombre: 'Dietética' },
  { key: 'Programacion',                      emoji: '💻', nombre: 'Programación' },
  { key: 'Ciberseguridad',                    emoji: '🔒', nombre: 'Ciberseguridad' },
  { key: 'Electricidad',                      emoji: '⚡', nombre: 'Electricidad' },
  { key: 'Robótica_y_Automatización',         emoji: '🤖', nombre: 'Robótica y Automatización' },
  { key: 'Recursos_Humanos',                  emoji: '👥', nombre: 'Recursos Humanos' },
  { key: 'Comercio_Internacional_y_Aduanas',  emoji: '🌍', nombre: 'Comercio Internacional y Aduanas' },
];

// Lista de nombres derivada de categorias (evita duplicar datos)
const especialidades = categorias.map((c) => c.nombre);

// ─── ELEMENTOS DEL DOM ───────────────────────────────────────────────────────
const form          = document.getElementById('testForm');
const submitBtn     = document.getElementById('submitBtn');
const progress      = document.getElementById('progress');
const progressText  = document.getElementById('progress-text');
const questionsRoot = document.getElementById('questionsRoot');

const screens = {
  home:   document.getElementById('home-screen'),
  test:   document.getElementById('test-screen'),
  result: document.getElementById('result-screen'),
};

let totalQuestions = 0;

// ─── NAVEGACIÓN ──────────────────────────────────────────────────────────────
function showScreen(screenName) {
  Object.values(screens).forEach((el) => el.classList.remove('active'));
  screens[screenName].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── LOCALSTORAGE ────────────────────────────────────────────────────────────
function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage lleno o deshabilitado:', e);
  }
}

// ─── CONSTRUCCIÓN DEL FORMULARIO ─────────────────────────────────────────────
const LABELS = ['Nada', 'Poco', 'Neutral', 'Bastante', 'Mucho'];

function buildQuestions(preguntas) {
  questionsRoot.innerHTML = '';
  let contador = 0;

  categorias.forEach((categoria) => {
    const lista = preguntas[categoria.key] || [];
    if (lista.length === 0) return;

    const inicioSeccion = contador + 1;
    const finSeccion    = contador + lista.length;

    const section = document.createElement('div');
    section.className = 'form-section';
    section.innerHTML = `
      <h2 class="section-title">${categoria.emoji} ${categoria.nombre}</h2>
      <p class="section-desc">Preguntas ${inicioSeccion}–${finSeccion}</p>
    `;

    lista.forEach((texto) => {
      contador += 1;
      const n = contador;

      const question = document.createElement('div');
      question.className = 'question';
      question.dataset.num = String(n);

      // Opciones con patrón accesible: radio oculto + label estilizado
      const opcionesHTML = [1, 2, 3, 4, 5].map((val, idx) => `
        <div class="option">
          <input type="radio" name="p${n}" id="p${n}_${val}" value="${val}">
          <label class="option-label" for="p${n}_${val}">${LABELS[idx]}</label>
        </div>
      `).join('');

      question.innerHTML = `
        <div class="question-header">
          <span class="question-num">${n}.</span>
          <span class="question-text">${texto}</span>
        </div>
        <div class="options">${opcionesHTML}</div>
      `;
      section.appendChild(question);
    });

    questionsRoot.appendChild(section);
  });

  totalQuestions = contador;
  submitBtn.textContent = 'Enviar Test Completo';
}

// ─── PERSISTENCIA DE PROGRESO ────────────────────────────────────────────────
function restoreSavedData() {
  const savedResponses = loadJSON(STORAGE_KEY, {});
  Object.entries(savedResponses).forEach(([name, value]) => {
    const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
  });

  const personal = loadJSON(PERSONAL_DATA_KEY, {});
  if (form.nombre) form.nombre.value = personal.nombre || '';
  if (form.edad)   form.edad.value   = personal.edad   || '';
  if (form.correo) form.correo.value = personal.correo || '';
}

function saveProgress() {
  const responses = {};
  for (let i = 1; i <= totalQuestions; i += 1) {
    const checked = form.querySelector(`input[name="p${i}"]:checked`);
    if (checked) responses[`p${i}`] = checked.value;
  }
  saveJSON(STORAGE_KEY, responses);
  saveJSON(PERSONAL_DATA_KEY, {
    nombre: form.nombre?.value || '',
    edad:   form.edad?.value   || '',
    correo: form.correo?.value || '',
  });
}

// ─── PROGRESO Y VALIDACIÓN ───────────────────────────────────────────────────
function getAnsweredCount() {
  let answered = 0;
  for (let i = 1; i <= totalQuestions; i += 1) {
    if (form.querySelector(`input[name="p${i}"]:checked`)) answered += 1;
  }
  return answered;
}

function updateProgress() {
  const answered = getAnsweredCount();
  const pct = totalQuestions ? Math.round((answered / totalQuestions) * 100) : 0;

  progress.style.width = `${pct}%`;
  progressText.textContent = `${answered}/${totalQuestions} (${pct}%)`;

  const falta = totalQuestions - answered;
  submitBtn.disabled    = falta > 0;
  submitBtn.textContent = falta > 0
    ? `Faltan ${falta} pregunta${falta === 1 ? '' : 's'}`
    : 'Enviar Test Completo ✅';

  document.querySelectorAll('.question').forEach((q) => {
    const num = q.dataset.num;
    q.classList.toggle('unanswered', !form.querySelector(`input[name="p${num}"]:checked`));
  });
}

// Recoge respuestas y retorna { respuestas, missing }
// Una sola pasada en lugar de dos iteraciones separadas
function collectAndValidate() {
  const respuestas = {};
  const missing    = [];

  for (let i = 1; i <= totalQuestions; i += 1) {
    const checked = form.querySelector(`input[name="p${i}"]:checked`);
    if (checked) {
      respuestas[`p${i}`] = checked.value;
    } else {
      respuestas[`p${i}`] = null;
      missing.push(i);
    }
  }
  return { respuestas, missing };
}

// ─── CÁLCULO DE PUNTAJES ──────────────────────────────────────────────────────
// Itera por categoría según el orden de `categorias`, no por nombre de especialidad,
// evitando bugs si el orden del array se modifica.
function calcularPuntajes(respuestas) {
  const puntajes = {};

  categorias.forEach((cat, i) => {
    const inicio = i * QUESTIONS_PER_AREA + 1;
    let total = 0;
    for (let j = inicio; j < inicio + QUESTIONS_PER_AREA; j += 1) {
      total += Number(respuestas[`p${j}`] || 0);
    }
    puntajes[cat.nombre] = total;
  });

  return puntajes;
}

// ─── RENDERIZADO DE RESULTADOS ───────────────────────────────────────────────
function renderResultados({ nombre, edad, correo, puntajes, top3, carreraPrincipal }) {
  document.getElementById('studentName').textContent = nombre;
  document.getElementById('studentMeta').textContent = `${edad} años | ${correo}`;
  document.getElementById('careerName').textContent  = carreraPrincipal;

  const medals = ['🥇', '🥈', '🥉'];
  document.getElementById('top3Container').innerHTML = top3.map(([esp, puntos], i) => `
    <div class="result-card">
      <strong>${medals[i]} ${i + 1}º Lugar: ${esp}</strong>
      <div>${puntos}/${MAX_SCORE} (${Math.round((puntos / MAX_SCORE) * 100)}%)</div>
    </div>
  `).join('');

  // Añade emoji a cada especialidad usando el mapa de categorias
  const emojiMap = Object.fromEntries(categorias.map((c) => [c.nombre, c.emoji]));

  document.getElementById('scoresGrid').innerHTML = Object.entries(puntajes).map(([esp, puntos]) => `
    <div class="score-card ${esp === carreraPrincipal ? 'highlight' : ''}">
      <div class="score-icon" aria-hidden="true">${emojiMap[esp] ?? '📌'}</div>
      <div class="score-info">
        <span class="score-name">${esp}</span>
        <div class="score-progress">
          <div class="score-progress-fill" style="width:${Math.round((puntos / MAX_SCORE) * 100)}%"></div>
        </div>
        <span class="score-value">${puntos}/${MAX_SCORE}</span>
      </div>
    </div>
  `).join('');
}

// ─── EMAILJS ─────────────────────────────────────────────────────────────────
function emailJsConfigurado() {
  return EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId;
}

function initEmailJS() {
  if (typeof emailjs !== 'undefined' && emailJsConfigurado()) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }
}

function mostrarAvisoCorreo(texto, exito = true) {
  const aviso = document.getElementById('emailNotice');
  const span  = document.getElementById('emailNoticeText');
  if (!aviso || !span) return;
  span.textContent = texto;
  aviso.style.display = 'flex';
  aviso.style.borderLeft = `4px solid ${exito ? 'var(--secondary)' : 'var(--danger)'}`;
}

async function enviarCorreoAutomatico(record) {
  if (typeof emailjs === 'undefined') {
    console.warn('[EmailJS] SDK no disponible.');
    return;
  }
  if (!emailJsConfigurado()) {
    console.info('[EmailJS] No configurado — edita EMAILJS_CONFIG en script.js para activar el envío.');
    return;
  }

  try {
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
      nombre:    record.nombre,
      resultado: record.carreraPrincipal,
      top1:      record.top3?.[0]?.[0] || '',
      top2:      record.top3?.[1]?.[0] || '',
      top3:      record.top3?.[2]?.[0] || '',
      to_email:  record.correo,
    });
    mostrarAvisoCorreo(`✅ Resultados enviados a ${record.correo}`, true);
  } catch (error) {
    console.error('[EmailJS] Error al enviar:', error);
    mostrarAvisoCorreo('⚠️ No se pudo enviar el correo. Guarda una captura de tus resultados.', false);
  }
}

// ─── GUARDADO DE REGISTRO ────────────────────────────────────────────────────
function guardarRegistro(record) {
  const registros = loadJSON(RECORDS_KEY, []);
  registros.push(record);

  // Limita el historial a MAX_RECORDS entradas más recientes
  const recortado = registros.slice(-MAX_RECORDS);
  saveJSON(RECORDS_KEY, recortado);

  saveJSON(LAST_RESULT_KEY, {
    carreraPrincipal: record.carreraPrincipal,
    correo:           record.correo,
    fechaISO:         record.fechaISO,
  });
}

// ─── INICIALIZACIÓN ──────────────────────────────────────────────────────────
async function init() {
  initEmailJS();

  // Cargar preguntas desde JSON
  try {
    const response = await fetch('preguntas.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const preguntas = await response.json();
    buildQuestions(preguntas);
    restoreSavedData();
    updateProgress();
  } catch (error) {
    submitBtn.disabled    = true;
    submitBtn.textContent = 'No se pudieron cargar las preguntas';
    questionsRoot.innerHTML = `
      <p class="load-error">
        ❌ Error al cargar <code>preguntas.json</code>.<br>
        Abre el proyecto con un servidor estático:<br>
        <code>python3 -m http.server 5500</code>
      </p>`;
    console.error('[init] Error cargando preguntas:', error);
    return;
  }

  // Guardar progreso al cambiar cualquier respuesta
  form.addEventListener('change', () => {
    saveProgress();
    updateProgress();
  });

  // Envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación nativa de campos requeridos (nombre, edad, correo)
    if (!form.reportValidity()) return;

    const { respuestas, missing } = collectAndValidate();

    if (missing.length > 0) {
      const lista = missing.slice(0, 20).join(', ') + (missing.length > 20 ? '…' : '');
      alert(`❌ Faltan ${missing.length} pregunta${missing.length === 1 ? '' : 's'}:\n${lista}`);
      document.querySelector(`[data-num="${missing[0]}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const puntajes        = calcularPuntajes(respuestas);
    const top3            = Object.entries(puntajes).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const carreraPrincipal = top3[0]?.[0] ?? 'Sin resultado';

    const record = {
      nombre:           form.nombre.value.trim(),
      edad:             form.edad.value,
      correo:           form.correo.value.trim(),
      respuestas,
      puntajes,
      top3,
      carreraPrincipal,
      fechaISO:         new Date().toISOString(),
    };

    guardarRegistro(record);

    // Limpia el progreso guardado (ya no se necesita)
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PERSONAL_DATA_KEY);

    renderResultados(record);
    showScreen('result');

    // Envío de correo en segundo plano (no bloquea la pantalla de resultados)
    enviarCorreoAutomatico(record);
  });
}

// ─── EVENTOS DE NAVEGACIÓN ───────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', () => showScreen('test'));

document.getElementById('backHomeBtn').addEventListener('click', () => showScreen('home'));

document.getElementById('toHomeBtn').addEventListener('click', () => showScreen('home'));

document.getElementById('retryBtn').addEventListener('click', () => {
  form.reset();
  updateProgress();
  showScreen('test');
});

// Aviso antes de salir si hay respuestas en curso
window.addEventListener('beforeunload', (e) => {
  if (Object.keys(loadJSON(STORAGE_KEY, {})).length > 0) {
    e.preventDefault();
    e.returnValue = 'Tienes respuestas guardadas. ¿Seguro que quieres salir?';
  }
});

// ─── ARRANQUE ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);