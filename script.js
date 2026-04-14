const STORAGE_KEY = 'cbtis106_test_responses';
const PERSONAL_DATA_KEY = 'cbtis106_personal_data';
const RECORDS_KEY = 'cbtis106_registros';
const EMBEDDED_QUESTIONS = {"Dietetica": ["Me interesa aprender cómo la alimentación influye en la salud de las personas.", "Me gusta investigar sobre vitaminas, nutrientes y dietas saludables.", "Disfruto preparar alimentos saludables o experimentar con recetas nutritivas.", "Me gustaría ayudar a personas a mejorar su alimentación.", "Me interesa saber cómo prevenir enfermedades a través de la alimentación.", "Me gusta aprender sobre el funcionamiento del cuerpo humano.", "Me interesa conocer cómo afectan los alimentos al rendimiento físico o mental.", "Me gustaría trabajar en hospitales, clínicas o centros de salud.", "Me interesa calcular calorías y requerimientos nutricionales.", "Me gusta orientar a otras personas sobre hábitos saludables.", "Me interesa la relación entre alimentación y deporte.", "Me gustaría diseñar planes de alimentación para diferentes personas.", "Me gusta leer o investigar sobre nutrición.", "Me interesa la higiene y manejo adecuado de los alimentos.", "Me gustaría trabajar promoviendo estilos de vida saludables."], "Programacion": ["Me gusta resolver problemas utilizando lógica o pasos ordenados.", "Me interesa aprender a crear aplicaciones o programas de computadora.", "Disfruto investigar cómo funcionan las páginas web o aplicaciones.", "Me gusta pasar tiempo usando computadoras para crear cosas nuevas.", "Me interesa aprender lenguajes de programación.", "Me gusta analizar problemas hasta encontrar una solución.", "Me gustaría desarrollar videojuegos o aplicaciones móviles.", "Me interesa automatizar tareas usando tecnología.", "Disfruto aprender nuevas herramientas digitales.", "Me gusta trabajar con datos e información digital.", "Me interesa saber cómo funcionan los sistemas informáticos.", "Me gusta pensar de manera lógica y estructurada.", "Me gustaría trabajar desarrollando software.", "Me gusta aprender cosas nuevas relacionadas con tecnología.", "Me siento cómodo trabajando muchas horas frente a la computadora."], "Ciberseguridad": ["Me interesa saber cómo proteger información en internet.", "Me gusta investigar cómo funcionan los sistemas de seguridad digital.", "Me interesa aprender cómo evitar fraudes o ataques informáticos.", "Disfruto resolver problemas tecnológicos complejos.", "Me interesa analizar riesgos y vulnerabilidades en sistemas.", "Me gustaría aprender a detectar intentos de hackeo.", "Me interesa la seguridad de redes y sistemas informáticos.", "Me gusta investigar cómo funcionan los virus o malware.", "Me gustaría proteger información importante de empresas u organizaciones.", "Me interesa aprender sobre privacidad digital.", "Me gusta analizar situaciones para encontrar fallas o debilidades.", "Me interesa trabajar con tecnología avanzada.", "Me gustaría participar en la protección de datos e información.", "Me interesa aprender sobre redes de computadoras.", "Me gusta resolver retos tecnológicos relacionados con seguridad."], "Electricidad": ["Me gusta entender cómo funciona la electricidad en casas o edificios.", "Me interesa instalar o reparar aparatos eléctricos.", "Me gusta trabajar con herramientas y equipos técnicos.", "Me interesa saber cómo se distribuye la energía eléctrica.", "Me gusta resolver problemas técnicos en equipos eléctricos.", "Me interesa aprender a leer diagramas eléctricos.", "Me gustaría instalar sistemas eléctricos en casas o industrias.", "Me gusta construir o armar dispositivos eléctricos.", "Me interesa aprender normas de seguridad eléctrica.", "Me gusta entender cómo funcionan motores eléctricos.", "Me interesa trabajar en proyectos de energía.", "Me gusta aprender cómo funcionan las instalaciones eléctricas.", "Me gustaría trabajar en mantenimiento eléctrico.", "Me interesa la tecnología relacionada con energía.", "Me gusta realizar trabajos prácticos y técnicos."], "Robótica_y_Automatización": ["Me interesa aprender cómo funcionan los robots.", "Me gusta armar o construir dispositivos tecnológicos.", "Me interesa programar máquinas para que realicen tareas automáticamente.", "Me gusta participar en proyectos tecnológicos o de innovación.", "Me interesa aprender sobre sensores y motores.", "Me gustaría diseñar robots para resolver problemas.", "Me gusta experimentar con tecnología nueva.", "Me interesa la automatización de procesos industriales.", "Me gusta combinar programación con hardware.", "Me gustaría participar en competencias de robótica.", "Me interesa entender cómo funcionan las máquinas inteligentes.", "Me gusta trabajar en proyectos tecnológicos en equipo.", "Me interesa la inteligencia artificial aplicada a máquinas.", "Me gusta construir prototipos o inventos tecnológicos.", "Me gustaría trabajar desarrollando tecnología avanzada."], "Recursos_Humanos": ["Me gusta escuchar y ayudar a las personas a resolver problemas.", "Me interesa trabajar organizando equipos de trabajo.", "Me gusta aprender sobre liderazgo y motivación.", "Me interesa mejorar el ambiente laboral en las organizaciones.", "Me gusta mediar en conflictos entre personas.", "Me interesa aprender cómo se selecciona personal para una empresa.", "Me gustaría ayudar a las personas a desarrollar sus habilidades.", "Me interesa la capacitación y formación de trabajadores.", "Me gusta trabajar con personas más que con máquinas.", "Me interesa entender el comportamiento humano en el trabajo.", "Me gusta coordinar actividades y grupos.", "Me interesa promover valores y cultura organizacional.", "Me gustaría trabajar en el área administrativa de una empresa.", "Me interesa mejorar la comunicación entre personas.", "Me gusta apoyar el desarrollo profesional de otros."], "Comercio_Internacional_y_Aduanas": ["Me interesa conocer cómo se comercian productos entre países.", "Me gusta aprender sobre importación y exportación de mercancías.", "Me interesa conocer las leyes y regulaciones del comercio internacional.", "Me gustaría trabajar en aduanas o empresas de comercio exterior.", "Me interesa aprender sobre logística y transporte internacional.", "Me gusta conocer mercados de otros países.", "Me interesa negociar productos o servicios.", "Me gustaría trabajar en empresas que exportan productos.", "Me interesa aprender sobre tratados comerciales entre países.", "Me gusta investigar cómo se mueven los productos en el mundo.", "Me interesa aprender sobre trámites aduanales.", "Me gustaría trabajar en puertos, aeropuertos o fronteras comerciales.", "Me interesa la economía internacional.", "Me gusta aprender sobre negocios internacionales.", "Me interesa trabajar en empresas globales."]};
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


function construirMensajeCorreo(record) {
  const top3Texto = record.top3
    .map(([esp, puntos], i) => `${i + 1}. ${esp} — ${puntos}/75 (${Math.round((puntos / 75) * 100)}%)`)
    .join('\n');

  const todosLosResultados = Object.entries(record.puntajes)
    .sort((a, b) => b[1] - a[1])
    .map(([esp, puntos]) => `• ${esp}: ${puntos}/75 (${Math.round((puntos / 75) * 100)}%)`)
    .join('\n');

  return `Hola 👋

Gracias por realizar el test vocacional.

📊 Tu resultado fue:
👉 ${record.carreraPrincipal}

🏆 Top 3 recomendaciones:
${top3Texto}

📈 Todos tus resultados:
${todosLosResultados}

¡Mucho éxito en tu futuro!`;
}

function enviarResultado(recordData = null) {
function enviarResultado() {
  const correoInput = document.getElementById('correo');
  const correo = correoInput?.value?.trim();

  if (!correo) {
    alert('⚠️ Ingresa un correo válido para enviar el resultado.');
    showScreen('test');
    correoInput?.focus();
    return;
  }

  const lastResult = recordData || loadJSON(LAST_RESULT_KEY, null);
  const resultadoFallback = document.getElementById('careerName').textContent.trim();

  if (!lastResult && !resultadoFallback) {
  const lastResult = loadJSON(LAST_RESULT_KEY, null);
  const resultado = lastResult?.carreraPrincipal || document.getElementById('careerName').textContent.trim();

  if (!resultado) {
    alert('⚠️ No se encontró un resultado para enviar.');
    return;
  }

  const record = lastResult || {
    carreraPrincipal: resultadoFallback,
    top3: [[resultadoFallback, 0]],
    puntajes: { [resultadoFallback]: 0 }
  };

  const subject = encodeURIComponent('Resultado de tu Test Vocacional CBTIS 106');
  const body = encodeURIComponent(construirMensajeCorreo(record));

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
  let preguntas = null;

  try {
    const response = await fetch('preguntas.json');
    preguntas = await response.json();
  } catch (error) {
    preguntas = EMBEDDED_QUESTIONS;
  }

  if (!preguntas) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'No se pudieron cargar preguntas';
    questionsRoot.innerHTML = '<p style="color:#ef4444;font-weight:600;">Error al cargar preguntas.</p>';
    return;
  }

  buildQuestions(preguntas);
  restoreSavedData();
  updateProgress();

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
    enviarResultado(record);
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
