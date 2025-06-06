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