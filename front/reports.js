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
function mostrarReportes() {
        cuerpoTabla.innerHTML = "";
        db.collection("Reportes").orderBy("ID").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const nuevaFila = cuerpoTabla.insertRow();

                // Rellena las celdas con los datos del documento
                nuevaFila.insertCell().textContent = data.ID || "";
                nuevaFila.insertCell().textContent = data.Concepto || "";
                nuevaFila.insertCell().textContent = data.Ubicacion || "";
                nuevaFila.insertCell().textContent = data.Asignacion || "";
                nuevaFila.insertCell().textContent = data.Estado || "";
                nuevaFila.insertCell().textContent = data.Fecha || "";

                // Botón Editar
                const celdaEditar = nuevaFila.insertCell();
                const imgEditar = document.createElement('img');
                imgEditar.src = './img/lapiz.png';
                imgEditar.alt = 'Editar';
                imgEditar.style.cursor = 'pointer';
                imgEditar.style.width = '24px';
                imgEditar.onclick = () => abrirModalEditar(doc.id, data);
                celdaEditar.appendChild(imgEditar);

                // Botón Eliminar
                const celdaEliminar = nuevaFila.insertCell();
                const imgEliminar = document.createElement('img');
                imgEliminar.src = './img/basura.png';
                imgEliminar.alt = 'Eliminar';
                imgEliminar.style.cursor = 'pointer';
                imgEliminar.style.width = '24px';
                imgEliminar.onclick = () => {
                    if (confirm(`¿Seguro que quieres eliminar el reporte #${data.ID}?`)) {
                        db.collection("Reportes").doc(doc.id).delete().then(mostrarReportes);
                    }
                };
                celdaEliminar.appendChild(imgEliminar);
            });
        });
    }*/

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

/**
 * Maneja el clic en el botón para agregar un nuevo reporte.
 */
document.getElementById('btnAgregarReporte').onclick = function() {
  // Para una mejor experiencia de usuario, es recomendable usar un modal en lugar de prompts.
  const concepto = prompt("Concepto:");
  const ubicacion = prompt("Ubicación:");
  const asignacion = prompt("Asignación:");
  const estado = prompt("Estado:");
  const fecha = prompt("Fecha (ejemplo: 2024-06-01):");

  // Evita agregar si el usuario cancela alguno de los prompts
  if (!concepto || !ubicacion || !asignacion || !estado || !fecha) {
    console.log("Operación cancelada por el usuario.");
    return;
  }

  // Lógica para obtener el último ID y sumarle 1
  db.collection("Reportes").orderBy("ID", "desc").limit(1).get().then(snapshot => {
    let nuevoId = 1;
    if (!snapshot.empty) {
      const ultimoId = snapshot.docs[0].data().ID || 0;
      nuevoId = ultimoId + 1;
    }
    
    db.collection("Reportes").add({
      ID: nuevoId,
      Concepto: concepto,
      Ubicacion: ubicacion,
      Asignacion: asignacion,
      Estado: estado,
      Fecha: fecha
    }).then(mostrarReportes);
  });
};

/**
 * Abre y llena el modal para editar un reporte existente.
 * @param {string} docId - El ID del documento de Firestore.
 * @param {object} data - Los datos del documento a editar.
 */
function abrirModalEditar(docId, data) {
  document.getElementById('modalEditar').style.display = 'flex';
  document.getElementById('editId').value = docId; // Almacena el ID del documento
  document.getElementById('editConcepto').value = data.Concepto || '';
  llenarSelectTecnicosActivos(data.Asignacion || "")
  document.getElementById('editEstado').value = data.Estado || '';
}

/**
 * Cierra el modal de edición.
 */
function cerrarModalEditar() {
  document.getElementById('modalEditar').style.display = 'none';
}

/**
 * Maneja el envío del formulario de edición para actualizar el reporte en Firestore.
 */
document.getElementById('formEditar').onsubmit = function(e) {
  e.preventDefault(); // Previene que la página se recargue
  const docId = document.getElementById('editId').value;

  db.collection("Reportes").doc(docId).update({
    Concepto: document.getElementById('editConcepto').value,
    Asignacion: document.getElementById('editAsignacion').value,
    Estado: document.getElementById('editEstado').value,
  }).then(() => {
    cerrarModalEditar(); // CORRECCIÓN: Usar el nombre correcto de la función
    mostrarReportes();   // Refrescar la tabla para mostrar los cambios
  });
};

document.getElementById('formEditar').onsubmit = function(event) {
  event.preventDefault();

  // 2. Obtiene el ID único del documento que estamos editando.
  const docId = document.getElementById('editId').value;

  // 3. Verifica que tengamos un ID para evitar errores.
  if (!docId) {
    console.error("Error: No se encontró el ID del documento para editar.");
    return;
  }

  const nuevoConcepto = document.getElementById('editConcepto').value;
  const nuevaAsignacion = document.getElementById('editAsignacion').value;
  const nuevoEstado = document.getElementById('editEstado').value;

  db.collection("Reportes").doc(docId).update({
    Concepto: nuevoConcepto,
    Asignacion: nuevaAsignacion,
    Estado: nuevoEstado
  })
  .then(() => {
    console.log("Reporte actualizado con éxito!");
    // 6. Cierra el modal y refresca la tabla para mostrar los cambios.
    cerrarModalEditar();
    mostrarReportes();
  })
  .catch((error) => {
    console.error("Error al actualizar el reporte: ", error);
  });
};

/**
 * Cierra el modal de edición.
 */
function cerrarModalEditar() {
  document.getElementById('modalEditar').style.display = 'none';
}

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

      // Botón Editar
      const celdaEditar = nuevaFila.insertCell();
      const imgEditar = document.createElement('img');
      imgEditar.src = './img/lapiz.png';
      imgEditar.alt = 'Editar';
      imgEditar.style.cursor = 'pointer';
      imgEditar.style.width = '24px';
      imgEditar.onclick = function () {
        abrirModalEditar(data._docId, data);
      };
      celdaEditar.appendChild(imgEditar);

      // Botón Eliminar
      const celdaEliminar = nuevaFila.insertCell();
      const imgEliminar = document.createElement('img');
      imgEliminar.src = './img/basura.png';
      imgEliminar.alt = 'Eliminar';
      imgEliminar.style.cursor = 'pointer';
      imgEliminar.style.width = '24px';
      imgEliminar.onclick = function () {
        db.collection("Reportes").doc(data._docId).delete().then(mostrarReportes);
      };
      celdaEliminar.appendChild(imgEliminar);
    }
  });
}

// Asocia la búsqueda al botón y al input
document.getElementById('search').onclick = renderTablaFiltrada;
document.getElementById('searchterm').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') renderTablaFiltrada();
});

function llenarSelectTecnicosActivos(tecnicoIdSeleccionado = "") {
  const select = document.getElementById('editAsignacion');
  select.innerHTML = '<option value="">Selecciona un técnico</option>';
  db.collection("Tecnicos").where("Estado", "==", "Activo").get().then(snapshot => {
    snapshot.forEach(doc => {
      const idTecnico = doc.data().ID;
      const option = document.createElement('option');
      option.value = idTecnico;
      option.textContent = idTecnico;
      if (idTecnico === tecnicoIdSeleccionado) option.selected = true;
      select.appendChild(option);
    });
  });
}