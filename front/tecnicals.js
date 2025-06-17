// --- Menú lateral y animaciones ---
$(document).ready(function () {
  $('.btn').click(function () {
    $(this).toggleClass("click");
    $('.sidebar').toggleClass("show");
    setTimeout(function () {
      if (typeof map !== "undefined") map.invalidateSize();
    }, 410);
  });
  $('.feat-btn').click(function () {
    $('nav ul .feat-show').toggleClass("show");
    $('nav ul .first').toggleClass("rotate");
  });
  $('.serv-btn').click(function () {
    $('nav ul .serv-show').toggleClass("show1");
    $('nav ul .second').toggleClass("rotate");
  });
  $('nav ul li').click(function () {
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
const db = firebase.firestore();

// --- Tabla de Técnicos ---
const tabla = document.querySelector('table');
const cuerpoTabla = tabla.querySelector('tbody');
let todosLosTecnicos = []; // Array para almacenar todos los técnicos

function mostrarTecnicos() {
  cuerpoTabla.innerHTML = "";
  todosLosTecnicos = []; // Limpia el array aquí
  db.collection("Tecnicos").orderBy("ID").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data._docId = doc.id; // Guarda el id para editar/eliminar
      todosLosTecnicos.push(data);
    });
    renderTablaFiltrada();
  });
}

// Llama a la función al cargar la página
mostrarTecnicos();

// --- Agregar Técnico ---
// Mostrar el modal de agregar técnico
document.getElementById('btnAgregar').onclick = function () {
  document.getElementById('modalAgregar').style.display = 'flex';
};

// Cerrar el modal de agregar técnico
function cerrarModalAgregar() {
  document.getElementById('modalAgregar').style.display = 'none';
  document.getElementById('formAgregar').reset();
}

// Guardar el nuevo técnico
document.getElementById('formAgregar').onsubmit = function (e) {
  e.preventDefault();
  const id = document.getElementById('addId').value;
  const nombre = document.getElementById('addNombre').value;
  const apellidos = document.getElementById('addApellidos').value;
  const contacto = document.getElementById('addContacto').value;
  const estado = document.getElementById('addEstado').value;

  db.collection("Tecnicos").orderBy("ID", "desc").limit(1).get().then(snapshot => {
    db.collection("Tecnicos").add({
      ID: id,
      Nombre: nombre,
      Apellidos: apellidos,
      Contacto: contacto,
      Estado: estado
    }).then(() => {
      cerrarModalAgregar();
      mostrarTecnicos();
    });
  });
};

// Función para abrir el modal y llenar los campos
function abrirModalEditar(docId, data) {
  document.getElementById('modalEditar').style.display = 'flex';
  document.getElementById('editId').value = docId;
  document.getElementById('editNombre').value = data.Nombre || '';
  document.getElementById('editApellidos').value = data.Apellidos || '';
  document.getElementById('editContacto').value = data.Contacto || '';
  document.getElementById('editEstado').value = data.Estado || '';
}

// Función para cerrar el modal
function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

// Guardar cambios al editar
document.getElementById('formEditar').onsubmit = function (e) {
  e.preventDefault();
  const docId = document.getElementById('editId').value;
  db.collection("Tecnicos").doc(docId).update({
    Nombre: document.getElementById('editNombre').value,
    Apellidos: document.getElementById('editApellidos').value,
    Contacto: document.getElementById('editContacto').value,
    Estado: document.getElementById('editEstado').value
  }).then(() => {
    cerrarModal();
    mostrarTecnicos();
  });
};

let filtroEstadoSeleccionado = "";
let filtroContactoSeleccionado = "";
let filtroApellidosSeleccionado = "";
let filtroNombreSeleccionado = "";
let filtroIdSeleccionado = "";

// Menú Estado
document.getElementById('btnDesplegarEstado').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuEstado');
  const valores = [...new Set(todosLosTecnicos.map(t => t.Estado))];
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

// Menú Contacto
document.getElementById('btnDesplegarContacto').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuContacto');
  const valores = [...new Set(todosLosTecnicos.map(t => t.Contacto))];
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuContacto').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroContactoSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};
// Menú Apellidos
document.getElementById('btnDesplegarApellidos').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuApellidos');
  const valores = [...new Set(todosLosTecnicos.map(t => t.Apellidos))];
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuApellidos').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroApellidosSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};

// Menú Nombre
document.getElementById('btnDesplegarNombre').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuNombre');
  const valores = [...new Set(todosLosTecnicos.map(t => t.Nombre))];
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuNombre').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroNombreSeleccionado = e.target.dataset.value;
    this.style.display = 'none';
    renderTablaFiltrada();
  }
};
// Menú ID
document.getElementById('btnDesplegarId').onclick = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('menuId');
  const valores = [...new Set(todosLosTecnicos.map(t => t.ID))];
  menu.innerHTML = '<div data-value="">Todos</div>' +
    valores.map(v => `<div data-value="${v}">${v}</div>`).join('');
  menu.style.display = 'block';
  const rect = this.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  menu.style.top = (rect.bottom + 4) + 'px';
};
document.getElementById('menuId').onclick = function (e) {
  if (e.target.dataset.value !== undefined) {
    filtroIdSeleccionado = e.target.dataset.value;
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


// En tu renderTablaFiltrada, usa filtroEstadoSeleccionado:
function renderTablaFiltrada() {
  const filtroEstado = filtroEstadoSeleccionado;
  const filtroContacto = filtroContactoSeleccionado;
  const filtroApellidos = filtroApellidosSeleccionado;
  const filtroNombre = filtroNombreSeleccionado;
  const filtroId = filtroIdSeleccionado;
  const searchTerm = document.getElementById('searchterm').value.trim().toLowerCase();
  const cuerpoTabla = document.querySelector('tbody');
  cuerpoTabla.innerHTML = "";
  todosLosTecnicos.forEach((data) => {
    const coincideBusqueda =
      searchTerm === "" ||
      (data.ID?.toString().toLowerCase().includes(searchTerm)) ||
      (data.Nombre?.toLowerCase().includes(searchTerm)) ||
      (data.Apellidos?.toLowerCase().includes(searchTerm)) ||
      (data.Contacto?.toLowerCase().includes(searchTerm)) ||
      (data.Estado?.toLowerCase().includes(searchTerm));

    if (
      (filtroEstado === "" || data.Estado === filtroEstado) &&
      (filtroContacto === "" || data.Contacto === filtroContacto) &&
      (filtroApellidos === "" || data.Apellidos === filtroApellidos) &&
      (filtroNombre === "" || data.Nombre === filtroNombre) &&
      (filtroId === "" || data.ID === filtroId) &&
      coincideBusqueda
    ) {
      const nuevaFila = cuerpoTabla.insertRow();
      nuevaFila.insertCell().textContent = data.ID || "";
      nuevaFila.insertCell().textContent = data.Nombre || "";
      nuevaFila.insertCell().textContent = data.Apellidos || "";
      nuevaFila.insertCell().textContent = data.Contacto || "";
      nuevaFila.insertCell().textContent = data.Estado || "";

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
        db.collection("Tecnicos").doc(data._docId).delete().then(mostrarTecnicos);
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

