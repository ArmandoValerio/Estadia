// --- Menú lateral y animaciones ---
$(document).ready(function() {
  $('.btn').click(function(){
    $(this).toggleClass("click");
    $('.sidebar').toggleClass("show");
    setTimeout(function() {
      if (typeof map !== "undefined") map.invalidateSize();
    }, 410);
  });
  $('.feat-btn').click(function(){
    $('nav ul .feat-show').toggleClass("show");
    $('nav ul .first').toggleClass("rotate");
  });
  $('.serv-btn').click(function(){
    $('nav ul .serv-show').toggleClass("show1");
    $('nav ul .second').toggleClass("rotate");
  });
  $('nav ul li').click(function(){
    $(this).addClass("active").siblings().removeClass("active");
  });
});
// --- Firebase Configuración ---
const firebaseConfig = {
  apiKey: "AIzaSyA_cHe-2we5iphebELRkAQMvrsUmk6JmMA",
  authDomain: "estadia-1ae6b.firebaseapp.com",
  projectId: "estadia-1ae6b",
  storageBucket: "estadia-1ae6b.firebasestorage.app",
  messagingSenderId: "546513941878",
  appId: "1:546513941878:web:fcd0efa875b08331713657",
  measurementId: "G-ML4E1VGMMK"
};
firebase.initializeApp(firebaseConfig);
// Asegúrate de que Firebase está inicializado
// firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const tabla = document.querySelector('table');
const cuerpoTabla = tabla.querySelector('tbody');

/**
 * Muestra todos los reportes de la colección "Reportes" en la tabla HTML.
 * Ordena los reportes por el campo "ID".
 */
/**
function mostrarHistorial() {
  cuerpoTabla.innerHTML = ""; // Limpia la tabla antes de llenarla
  db.collection("Reportes").orderBy("ID").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const nuevaFila = cuerpoTabla.insertRow();

      // Crea y llena las celdas con los datos del documento
      nuevaFila.insertCell().textContent = data.ID || "";
      nuevaFila.insertCell().textContent = data.Concepto || "";
      nuevaFila.insertCell().textContent = data.Ubicacion || "";
      nuevaFila.insertCell().textContent = data.Asignacion || "";
      nuevaFila.insertCell().textContent = data.Estado || "";
      nuevaFila.insertCell().textContent = data.Fecha || "";

      // Botón Generar reporte
      const celdaGenerar = nuevaFila.insertCell();
      const imgGenerar = document.createElement('img');
        imgGenerar.src = './img/Docs.png';
        imgGenerar.alt = 'Editar';
        imgGenerar.style.cursor = 'pointer';
        imgGenerar.style.width = '24px';
        imgGenerar.onclick = () => abrirModalEditar(doc.id, data);
        celdaGenerar.appendChild(imgGenerar);

    });
  });
}

// Llama a la función para mostrar los reportes al cargar la página
mostrarHistorial();
 */
function mostrarReportes() {
  cuerpoTabla.innerHTML = "";
  todosLosReportes = []; // Limpia el array aquí
  db.collection("Reportes").orderBy("ID").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data._docId = doc.id; // Guarda el id para editar/eliminar
      todosLosReportes.push(data);
    });
    renderTablaFiltrada();
  });
}      
// Llama a la función para mostrar los reportes al cargar la página
mostrarReportes();

let filtroConceptoSeleccionado = "";
let filtroAsignacionSeleccionado = "";
let filtroEstadoSeleccionado = "";
let filtroFechaSeleccionado = "";

document.getElementById('btnDesplegarConcepto').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuConcepto');
  const valores = [...new Set(todosLosReportes.map(t => t.Concepto))].sort();
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuConcepto').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroConceptoSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};
document.getElementById('btnDesplegarAsignacion').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuAsignacion');
  const valores = [...new Set(todosLosReportes.map(t => t.Asignacion))].sort();
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuAsignacion').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroAsignacionSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};

document.getElementById('btnDesplegarEstado').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuEstado');
  const valores = [...new Set(todosLosReportes.map(t => t.Estado))].sort();
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuEstado').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroEstadoSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};

document.getElementById('btnDesplegarFecha').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuFecha');
  const valores = [...new Set(todosLosReportes.map(t => t.Fecha))].sort();
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuFecha').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroFechaSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};

// cerrar modales
document.addEventListener('click', function (e) {
  if (!e.target.closest('.menu-desplegable') && !e.target.closest('.list')) {
    document.querySelectorAll('.menu-desplegable').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});

function generarPDFReporte(reporte) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Reporte #00" + (reporte.ID || ""), 10, 20);

  doc.setFontSize(12);
  doc.text("Concepto: " + (reporte.Concepto || ""), 10, 35);
  doc.text("Ubicación: " + (reporte.Ubicacion || ""), 10, 45);
  doc.text("Asignación: " + (reporte.Asignacion || ""), 10, 55);
  doc.text("Estado: " + (reporte.Estado || ""), 10, 65);
  doc.text("Fecha: " + (reporte.Fecha || ""), 10, 75);

  doc.save("reporte_" + (reporte.ID || "sin_id") + ".pdf");
}

function renderTablaFiltrada() {
  const filtroConcepto = filtroConceptoSeleccionado;
  const filtroAsignacion = filtroAsignacionSeleccionado;
  const filtroEstado = filtroEstadoSeleccionado;
  const filtroFecha = filtroFechaSeleccionado;
  const searchTerm = document.getElementById('searchterm').value.trim().toLowerCase();
  const cuerpoTabla = document.querySelector('tbody');
  cuerpoTabla.innerHTML = "";
  todosLosReportes.forEach((data) => {
    // Aplica filtros y búsqueda combinados
    const coincideBusqueda =
      searchTerm === "" ||
      (data.ID?.toString().toLowerCase().includes(searchTerm)) ||
      (data.Concepto?.toLowerCase().includes(searchTerm)) ||
      (data.Ubicacion?.toLowerCase().includes(searchTerm)) ||
      (data.Asignacion?.toLowerCase().includes(searchTerm)) ||
      (data.Estado?.toLowerCase().includes(searchTerm)) ||
      (data.Fecha?.toLowerCase().includes(searchTerm));

    if (
      (filtroConcepto === "" || data.Concepto === filtroConcepto) &&
      (filtroAsignacion === "" || data.Asignacion === filtroAsignacion) &&
      (filtroEstado === "" || data.Estado === filtroEstado) &&
      (filtroFecha === "" || data.Fecha === filtroFecha) &&
      coincideBusqueda
    ) {
      const nuevaFila = cuerpoTabla.insertRow();

      const celdaId = nuevaFila.insertCell();
      celdaId.textContent = data.ID || "";
      
      const celdaConcepto = nuevaFila.insertCell();
      celdaConcepto.textContent = data.Concepto || "";

      const celdaUbicacion = nuevaFila.insertCell();
      celdaUbicacion.textContent = data.Ubicacion || "";

      const celdaAsignacion = nuevaFila.insertCell();
      celdaAsignacion.textContent = data.Asignacion || "";

      const celdaEstado = nuevaFila.insertCell();
      celdaEstado.textContent = data.Estado || "";

      const celdaFecha = nuevaFila.insertCell();
      celdaFecha.textContent = data.Fecha || "";

      // Botón Generar reporte
      const celdaDoc = nuevaFila.insertCell();
      const imgDoc = document.createElement('img');
      imgDoc.src = './img/Docs.png';
      imgDoc.alt = 'Generar';
      imgDoc.style.cursor = 'pointer';
      imgDoc.style.width = '24px';
      imgDoc.onclick = function () {
        generarPDFReporte(data);
      };
      celdaDoc.appendChild(imgDoc);
    }
  });
}

// Asocia la búsqueda al botón y al input
document.getElementById('search').onclick = renderTablaFiltrada;
document.getElementById('searchterm').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') renderTablaFiltrada();
});