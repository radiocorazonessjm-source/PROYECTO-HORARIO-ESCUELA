// ======== CONFIGURACIÓN GENERAL ========
const HORAS_MATUTINAS = ["8:00", "8:45", "9:30", "10:30", "11:15"];
const HORAS_VESPERTINAS = ["2:00", "2:40", "3:20", "4:15", "5:00"];
const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

const GRADOS_MATUTINOS = ["INICIAL A","1ERO A","1ERO B","2DO A","2DO B","2DO C","3RO A","3RO B","3RO C","4TO A"];
const GRADOS_VESPERTINOS = ["INICIAL B","4TO B","5TO A","5TO B","6TO A","6TO B","1ERO A MEDIA","1ERO B MEDIA","1ERO C MEDIA","2DO A MEDIA"];

const MATERIAS = [
  "Matemática","Lengua Española","Ciencias Sociales","Ciencias Naturales","Inglés",
  "Educación Física","Frances","Arte","Formación Humana","Moral y Civica"
];

const MAESTROS = [
  { username:'ANA LUCIA', name:'ANA LUCIA', password:'1234', role:'maestro' },
  { username:'ANA MARIA', name:'ANA MARIA', password:'1234', role:'maestro' },
  { username:'ENRIQUE', name:'ENRIQUE', password:'1234', role:'maestro' },
  { username:'ERICK', name:'ERICK', password:'1234', role:'maestro' },
  { username:'YIYINA', name:'YIYINA', password:'1234', role:'maestro' },
  { username:'INDIRA', name:'INDIRA', password:'1234', role:'maestro' },
  { username:'CRISEYDA', name:'CRISEYDA', password:'1234', role:'maestro' },
  { username:'LUISA MARIA', name:'LUISA MARIA', password:'1234', role:'maestro' },
  { username:'YOJANSEL', name:'YOJANSEL', password:'1234', role:'maestro' },
  { username:'YERALD', name:'YERALD', password:'1234', role:'maestro' },
  { username:'JUDITH', name:'YUDITH', password:'1234', role:'maestro' },
  { username:'MELANIO', name:'MELANIO', password:'1234', role:'maestro' },
  { username:'LUISA ANTONIA', name:'LUISA ANTONIA', password:'1234', role:'maestro' },
  { username:'YOLENNY', name:'YOLENNY', password:'1234', role:'maestro' },
  { username:'XIOMARA', name:'XIOMARA', password:'1234', role:'maestro' },
  { username:'NETANEL', name:'NETANEL', password:'1234', role:'maestro' },
  { username:'DANEYI', name:'DANEYI', password:'1234', role:'maestro' },
  // ... agrega todos los demás maestros
];


const USERS = [
  { username:'director', password:'admin123', role:'director', name:'Director Escolar' },
  { username:'coordinador', password:'1234', role:'coordinador', name:'Coordinador General' },
  ...MAESTROS
];


// ======== ELEMENTOS HTML ========
const loginSection = document.getElementById('login-section');
const directorSection = document.getElementById('director-section');
const coordinadorSection = document.getElementById('coordinador-section');
const maestroSection = document.getElementById('maestro-section');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const directorName = document.getElementById('director-name');
const gradosSection = document.getElementById('grados-section');
const cursoHorario = document.getElementById('curso-horario');
const maestroName = document.getElementById('maestro-name');
const maestroHorario = document.getElementById('maestro-horario');
const coordinadorHorarios = document.getElementById('coordinador-horarios');

const logoutBtns = document.querySelectorAll('#logout-btn, #logout-btn2, #logout-btn3');

let currentUser = null;
let tipoHorarioActual = "matutino";

// ======== LOGIN ========
loginBtn.addEventListener('click', ()=>{
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();
  const found = USERS.find(x=>x.username===u && x.password===p);
  if(!found) return alert('Credenciales incorrectas');
  currentUser = found;
  usernameInput.value = '';
  passwordInput.value = '';
  if(found.role==='director') showDirector();
  if(found.role==='coordinador') showCoordinador();
  if(found.role==='maestro') showMaestro(found.username);
});

logoutBtns.forEach(b=>b.addEventListener('click', ()=>location.reload()));

// ======== FUNCIONES DE HORARIOS ========
function getHorarios(){
  return JSON.parse(localStorage.getItem('horarios') || '{}');
}

function saveHorarios(data){
  localStorage.setItem('horarios', JSON.stringify(data));
}

// ======== DIRECTOR ========
function showDirector(){
  loginSection.classList.add('hidden');
  directorSection.classList.remove('hidden');
  directorName.textContent = currentUser.name;

  document.getElementById('matutino-btn').onclick = ()=>mostrarGrados('matutino');
  document.getElementById('vespertino-btn').onclick = ()=>mostrarGrados('vespertino');
}

function mostrarGrados(tipo){
  tipoHorarioActual = tipo;
  gradosSection.classList.remove('hidden');
  cursoHorario.classList.add('hidden');

  const lista = tipo === 'matutino' ? GRADOS_MATUTINOS : GRADOS_VESPERTINOS;

  gradosSection.innerHTML = `<h3>Selecciona un grado (${tipo.toUpperCase()})</h3>`;
  lista.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = g;
    btn.onclick = ()=>abrirHorarioCurso(g);
    gradosSection.appendChild(btn);
  });
}

function abrirHorarioCurso(grado){
  gradosSection.classList.add('hidden');
  cursoHorario.classList.remove('hidden');
  cursoHorario.innerHTML = `<h3>${grado} (${tipoHorarioActual.toUpperCase()})</h3>`;

  const HORAS = tipoHorarioActual === 'matutino' ? HORAS_MATUTINAS : HORAS_VESPERTINAS;
  const horarios = getHorarios();

  if(!horarios[tipoHorarioActual]) horarios[tipoHorarioActual] = {};
  if(!horarios[tipoHorarioActual][grado]) horarios[tipoHorarioActual][grado] = [];

  const tabla = document.createElement('table');
  tabla.innerHTML = `<tr><th>Hora</th><th>Día</th><th>Maestro</th><th>Materia</th></tr>`;

  for(let i=0; i<HORAS.length; i++){
    const tr = document.createElement('tr');

    // Hora
    const tdHora = document.createElement('td');
    const selectHora = document.createElement('select');
    selectHora.innerHTML = `<option value="">--Hora--</option>` + HORAS.map(h=>`<option value="${h}">${h}</option>`).join('');
    tdHora.appendChild(selectHora);

    // Día
    const tdDia = document.createElement('td');
    const selectDia = document.createElement('select');
    selectDia.innerHTML = `<option value="">-- Día --</option>` + DIAS.map(d=>`<option value="${d}">${d}</option>`).join('');
    tdDia.appendChild(selectDia);

    // Maestro
    const tdMaestro = document.createElement('td');
    const selectM = document.createElement('select');
    selectM.innerHTML = `<option value="">-- Maestro --</option>` + MAESTROS.map(m=>`<option value="${m.username}">${m.name}</option>`).join('');
    tdMaestro.appendChild(selectM);

    // Materia
    const tdMateria = document.createElement('td');
    const selectMat = document.createElement('select');
    selectMat.innerHTML = `<option value="">-- Materia --</option>` + MATERIAS.map(mat=>`<option value="${mat}">${mat}</option>`).join('');
    tdMateria.appendChild(selectMat);

    tr.append(tdHora, tdDia, tdMaestro, tdMateria);
    tabla.appendChild(tr);
  }

  cursoHorario.appendChild(tabla);

  // ===== GUARDAR CAMBIOS CON VALIDACIÓN DE CONFLICTOS =====
  const guardarBtn = document.createElement('button');
  guardarBtn.className = 'btn';
  guardarBtn.textContent = 'Guardar Cambios';
  guardarBtn.onclick = ()=>{
    const filas = tabla.querySelectorAll('tr');
    const nuevasFilas = [];
    let conflicto = false;

    // Obtenemos los horarios actuales
    const todosHorarios = getHorarios();

    filas.forEach((f, i)=>{
      if(i===0) return;
      const selects = f.querySelectorAll('select');
      const hora = selects[0].value;
      const dia = selects[1].value;
      const maestro = selects[2].value;
      const materia = selects[3].value;

      if(hora && dia && maestro){
        // Revisión de conflictos:
        for(const tipo in todosHorarios){
          for(const curso in todosHorarios[tipo]){
            const horarioCurso = todosHorarios[tipo][curso];
            for(const fila of horarioCurso){
              if(
                fila.maestro === maestro &&
                fila.hora === hora &&
                fila.dia === dia &&
                !(tipo === tipoHorarioActual && curso === grado) // evita compararse consigo mismo
              ){
                const nombreMaestro = MAESTROS.find(m=>m.username===maestro)?.name || maestro;
                conflicto = true;
                alert(`⚠️ Conflicto: ${nombreMaestro} ya tiene clase el ${dia} a las ${hora} en ${curso} (${tipo.toUpperCase()}).`);
                break;
              }
            }
            if(conflicto) break;
          }
          if(conflicto) break;
        }
      }

      nuevasFilas.push({ hora, dia, maestro, materia });
    });

    if(conflicto) {
      alert('⛔ No se pudo guardar. Corrige los conflictos de horario.');
      return;
    }

    // Guardado seguro sin conflicto
    todosHorarios[tipoHorarioActual][grado] = nuevasFilas;
    saveHorarios(todosHorarios);
    actualizarHorariosMaestros(todosHorarios);
    alert('✅ Horario guardado correctamente sin conflictos.');
  };
  cursoHorario.appendChild(guardarBtn);

  const volverBtn = document.createElement('button');
  volverBtn.className = 'btn red';
  volverBtn.textContent = 'Volver';
  volverBtn.onclick = ()=>mostrarGrados(tipoHorarioActual);
  cursoHorario.appendChild(volverBtn);
}

// ======== ACTUALIZAR HORARIOS DE MAESTROS ========
function actualizarHorariosMaestros(horarios){
  const maestrosHorarios = {};
  for(const tipo in horarios){
    for(const grado in horarios[tipo]){
      horarios[tipo][grado].forEach(fila=>{
        if(fila.maestro){
          if(!maestrosHorarios[fila.maestro]) maestrosHorarios[fila.maestro] = [];
          maestrosHorarios[fila.maestro].push({
            tipo, grado, dia:fila.dia, hora:fila.hora, materia:fila.materia
          });
        }
      });
    }
  }
  localStorage.setItem('horariosMaestros', JSON.stringify(maestrosHorarios));
}

// ======== MAESTRO ========
function showMaestro(username){
  loginSection.classList.add('hidden');
  maestroSection.classList.remove('hidden');
  maestroName.textContent = USERS.find(u=>u.username===username).name;

  const data = JSON.parse(localStorage.getItem('horariosMaestros') || '{}');
  const horario = data[username] || [];

  if(horario.length===0){
    maestroHorario.innerHTML = `<p>No tienes horario asignado todavía.</p>`;
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `<tr><th>Tanda</th><th>Grado</th><th>Día</th><th>Hora</th><th>Materia</th></tr>`;
  horario.forEach(h=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${h.tipo.toUpperCase()}</td><td>${h.grado}</td><td>${h.dia}</td><td>${h.hora}</td><td>${h.materia}</td>`;
    tabla.appendChild(tr);
  });
  maestroHorario.appendChild(tabla);
}

// ======== COORDINADOR ========
function showCoordinador(){
  loginSection.classList.add('hidden');
  coordinadorSection.classList.remove('hidden');
  coordinadorHorarios.innerHTML = `<h3>Selecciona un horario para ver</h3>
    <button class="btn" id="coord-matutino">Ver Matutino</button>
    <button class="btn" id="coord-vespertino">Ver Vespertino</button>
    <div id="coord-grados" class="hidden"></div>
    <div id="coord-curso" class="hidden"></div>`;

  document.getElementById('coord-matutino').onclick = ()=>coordMostrarGrados('matutino');
  document.getElementById('coord-vespertino').onclick = ()=>coordMostrarGrados('vespertino');
}

function coordMostrarGrados(tipo){
  const gradosDiv = document.getElementById('coord-grados');
  const cursoDiv = document.getElementById('coord-curso');
  gradosDiv.classList.remove('hidden');
  cursoDiv.classList.add('hidden');

  const lista = tipo === 'matutino' ? GRADOS_MATUTINOS : GRADOS_VESPERTINOS;
  gradosDiv.innerHTML = `<h3>Selecciona un grado (${tipo.toUpperCase()})</h3>`;
  lista.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = g;
    btn.onclick = ()=>coordVerHorario(tipo, g);
    gradosDiv.appendChild(btn);
  });
}

function coordVerHorario(tipo, grado){
  const horarios = getHorarios();
  const cursoDiv = document.getElementById('coord-curso');
  cursoDiv.classList.remove('hidden');
  cursoDiv.innerHTML = `<h3>${grado} (${tipo.toUpperCase()})</h3>`;

  if(!horarios[tipo] || !horarios[tipo][grado]){
    cursoDiv.innerHTML += `<p>No hay horario registrado para este grado.</p>`;
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `<tr><th>Hora</th><th>Día</th><th>Maestro</th><th>Materia</th></tr>`;
  horarios[tipo][grado].forEach(fila=>{
    const nombreMaestro = MAESTROS.find(m=>m.username===fila.maestro)?.name || fila.maestro;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${fila.hora}</td><td>${fila.dia}</td><td>${nombreMaestro}</td><td>${fila.materia}</td>`;
    tabla.appendChild(tr);
  });
  cursoDiv.appendChild(tabla);
}
