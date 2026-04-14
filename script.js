const STORAGE_KEY = 'cbtis106_test_responses';
const PERSONAL_DATA_KEY = 'cbtis106_personal_data';
const RECORDS_KEY = 'cbtis106_registros';
const LAST_RESULT_KEY = 'cbtis106_last_result';

const categorias = [
  { key: 'Dietetica', emoji: '🥗', nombre: 'Dietética' },
  { key: 'Programacion', emoji: '💻', nombre: 'Programación' },
  { key: 'Ciberseguridad', emoji: '🔒', nombre: 'Ciberseguridad' },
  { key: 'Electricidad', emoji: '⚡', nombre: 'Electricidad' },
  { key: 'Robótica_y_Automatización', emoji: '🤖', nombre: 'Robótica y Automatización' },
  { key: 'Recursos_Humanos', emoji: '👥', nombre: 'Recursos Humanos' },
  { key: 'Comercio_Internacional_y_Aduanas', emoji: '🌍', nombre: 'Comercio Internacional y Aduanas' }
];

const especialidades = [
  'Dietética',
  'Programación',
  'Ciberseguridad',
  'Electricidad',
  'Robótica y Automatización',
  'Recursos Humanos',
  'Comercio Internacional y Aduanas'
];

const form = document.getElementById('testForm');
const submitBtn = document.getElementById('submitBtn');
const progress = document.getElementById('progress');
const progressText = document.getElementById('progress-text');
const questionsRoot = document.getElementById('questionsRoot');

const screens = {
  home: document.getElementById('home-screen'),
  test: document.getElementById('test-screen'),
  result: document.getElementById('result-screen')
};

let totalQuestions = 0;

function showScreen(screenName) {
  Object.values(screens).forEach((el) => el.classList.remove('active'));
  screens[screenName].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function buildQuestions(preguntas) {
  questionsRoot.innerHTML = '';
  let contador = 0;

  categorias.forEach((categoria) => {
    const lista = preguntas[categoria.key] || [];
    if (lista.length === 0) return;

    const section = document.createElement('div');
    section.className = 'form-section';
    section.innerHTML = `
      <h2 class="section-title">${categoria.emoji} ${categoria.nombre}</h2>
      <p class="section-desc">Preguntas ${contador + 1} - ${contador + lista.length}</p>
    `;

    lista.forEach((texto) => {
      contador += 1;
      const question = document.createElement('div');
      question.className = 'question';
      question.dataset.num = String(contador);
      question.innerHTML = `
        <div class="question-header">
          <span class="question-num">${contador}.</span>
          <span class="question-text">${texto}</span>
        </div>
        <div class="options">
          ${[1, 2, 3, 4, 5].map((n, idx) => `<label class="radio-option"><input type="radio" name="p${contador}" value="${n}"> ${['Nada', 'Poco', 'Neutral', 'Bastante', 'Mucho'][idx]}</label>`).join('')}
        </div>
      `;
      section.appendChild(question);
    });

    questionsRoot.appendChild(section);
  });

  totalQuestions = contador;
  submitBtn.textContent = 'Enviar Test Completo';
}

function restoreSavedData() {
  const savedResponses = loadJSON(STORAGE_KEY, {});
  Object.entries(savedResponses).forEach(([name, value]) => {
    const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
  });

  const personal = loadJSON(PERSONAL_DATA_KEY, {});
  form.nombre.value = personal.nombre || '';
  form.edad.value = personal.edad || '';
  form.correo.value = personal.correo || '';
}

function saveProgress() {
  const responses = {};
  for (let i = 1; i <= totalQuestions; i += 1) {
    const checked = form.querySelector(`input[name="p${i}"]:checked`);
    if (checked) responses[`p${i}`] = checked.value;
  }

  saveJSON(STORAGE_KEY, responses);
  saveJSON(PERSONAL_DATA_KEY, {
    nombre: form.nombre.value,
    edad: form.edad.value,
    correo: form.correo.value
  });
}

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

  submitBtn.disabled = answered < totalQuestions;
  submitBtn.textContent = answered < totalQuestions
    ? `Faltan ${totalQuestions - answered} preguntas`
    : 'Enviar Test Completo ✅';

  document.querySelectorAll('.question').forEach((q) => {
    const num = q.dataset.num;
    q.classList.toggle('unanswered', !form.querySelector(`input[name="p${num}"]:checked`));
  });
}

function calcularPuntajes(respuestas) {
  const puntajes = Object.fromEntries(especialidades.map((esp) => [esp, 0]));
  const preguntasPorArea = 15;

  especialidades.forEach((esp, i) => {
    const inicio = (i * preguntasPorArea) + 1;
    const fin = inicio + preguntasPorArea;

    let total = 0;
    for (let j = inicio; j < fin; j += 1) {
      total += Number(respuestas[`p${j}`] || 0);
    }
    puntajes[esp] = total;
  });

  return puntajes;
}

function renderResultados({ nombre, edad, correo, puntajes, top3, carreraPrincipal }) {
  document.getElementById('studentName').textContent = nombre;
  document.getElementById('studentMeta').textContent = `${edad} años | ${correo}`;
  document.getElementById('careerName').textContent = carreraPrincipal;

  const top3Container = document.getElementById('top3Container');
  const medals = ['🥇', '🥈', '🥉'];
  top3Container.innerHTML = top3.map(([esp, puntos], i) => `
    <div class="result-card">
      <strong>${medals[i]} ${i + 1}º Lugar: ${esp}</strong>
      <div>${puntos}/75 (${Math.round((puntos / 75) * 100)}%)</div>
    </div>
  `).join('');

  const scoresGrid = document.getElementById('scoresGrid');
  scoresGrid.innerHTML = Object.entries(puntajes).map(([esp, puntos]) => `
    <div class="score-card ${esp === carreraPrincipal ? 'highlight' : ''}">
      <div class="score-info">
        <span class="score-name">${esp}</span>
        <div class="score-progress"><div class="score-progress-fill" style="width:${Math.round((puntos / 75) * 100)}%"></div></div>
        <span class="score-value">${puntos}/75</span>
      </div>
    </div>
  `).join('');
}


function enviarResultado() {
  const correoInput = document.getElementById('correo');
  const correo = correoInput?.value?.trim();

  if (!correo) {
    alert('⚠️ Ingresa un correo válido para enviar el resultado.');
    showScreen('test');
    correoInput?.focus();
    return;
  }

  const lastResult = loadJSON(LAST_RESULT_KEY, null);
  const resultado = lastResult?.carreraPrincipal || document.getElementById('careerName').textContent.trim();

  if (!resultado) {
    alert('⚠️ No se encontró un resultado para enviar.');
    return;
  }

  const subject = encodeURIComponent('Resultado de tu Test Vocacional CBTIS 106');
  const body = encodeURIComponent(
    `Hola 👋\n\nGracias por realizar el test vocacional.\n\n📊 Tu resultado fue:\n👉 ${resultado}\n\n¡Mucho éxito en tu futuro!`
  );

  window.location.href = `mailto:${encodeURIComponent(correo)}?subject=${subject}&body=${body}`;
}

function collectRespuestas() {
  const respuestas = {};
  for (let i = 1; i <= totalQuestions; i += 1) {
    respuestas[`p${i}`] = form.querySelector(`input[name="p${i}"]:checked`)?.value || null;
  }
  return respuestas;
}

function validateComplete() {
  const missing = [];
  for (let i = 1; i <= totalQuestions; i += 1) {
    if (!form.querySelector(`input[name="p${i}"]:checked`)) missing.push(i);
  }
  return missing;
}

async function init() {
  try {
    const response = await fetch('preguntas.json');
    const preguntas = await response.json();
    buildQuestions(preguntas);
    restoreSavedData();
    updateProgress();
  } catch (error) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'No se pudieron cargar preguntas';
    questionsRoot.innerHTML = '<p style="color:#ef4444;font-weight:600;">Error al cargar preguntas.json. Usa un servidor estático (por ejemplo <code>python3 -m http.server 5500</code>) para abrir el proyecto.</p>';
  }

  form.addEventListener('change', () => {
    saveProgress();
    updateProgress();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    const missing = validateComplete();
    if (missing.length > 0) {
      alert(`❌ Faltan ${missing.length} preguntas:\n${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '...' : ''}`);
      document.querySelector(`[data-num="${missing[0]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const respuestas = collectRespuestas();
    const puntajes = calcularPuntajes(respuestas);
    const top3 = Object.entries(puntajes).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const carreraPrincipal = top3[0]?.[0] ?? 'Sin resultado';

    const record = {
      nombre: form.nombre.value.trim(),
      edad: form.edad.value,
      correo: form.correo.value.trim(),
      respuestas,
      puntajes,
      top3,
      carreraPrincipal,
      fechaISO: new Date().toISOString()
    };

    const registros = loadJSON(RECORDS_KEY, []);
    registros.push(record);
    saveJSON(RECORDS_KEY, registros);
    saveJSON(LAST_RESULT_KEY, {
      carreraPrincipal: record.carreraPrincipal,
      correo: record.correo,
      fechaISO: record.fechaISO
    });

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PERSONAL_DATA_KEY);

    renderResultados(record);
    showScreen('result');
  });
}

document.getElementById('startBtn').addEventListener('click', () => showScreen('test'));
document.getElementById('backHomeBtn').addEventListener('click', () => showScreen('home'));
document.getElementById('sendResultBtn').addEventListener('click', enviarResultado);
document.getElementById('toHomeBtn').addEventListener('click', () => showScreen('home'));
document.getElementById('retryBtn').addEventListener('click', () => {
  form.reset();
  updateProgress();
  showScreen('test');
});

window.addEventListener('beforeunload', (e) => {
  if (Object.keys(loadJSON(STORAGE_KEY, {})).length > 0) {
    e.preventDefault();
    e.returnValue = 'Tienes respuestas guardadas automáticamente. ¿Seguro que quieres salir?';
  }
});

init();
