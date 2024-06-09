document.addEventListener('DOMContentLoaded', function() {
  console.log('La página está completamente cargada y lista.');

  // Simulación de añadir precios al carrito
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartTotalElement = document.getElementById('cart-total');
  let cartTotal = 0.00;

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const price = parseFloat(this.getAttribute('data-price'));
      cartTotal += price;
      cartTotalElement.textContent = cartTotal.toFixed(2) + '€';
    });
  });

  //Calendario
  const listaHoras = document.getElementById("listaHoras");
  let horasReservadas = JSON.parse(localStorage.getItem('horasReservadas')) || {};

  // Generar la lista de horas
  for (let hora = 10; hora <= 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
          const horaString = hora.toString().padStart(2, '0');
          const minutoString = minuto.toString().padStart(2, '0');
          const horaFormato = `${horaString}:${minutoString}`;

          const li = document.createElement("li");
          li.textContent = horaFormato;
          li.classList.add("hora-item");
          li.addEventListener("click", function() {
              toggleHoraReservada(this); // Alternar la reserva de la hora al hacer clic
          });

          listaHoras.appendChild(li);

          // Si es la segunda hora en la fila, añadir un salto de línea
          if (minuto === 30) {
              const br = document.createElement("br");
              listaHoras.appendChild(br);
          }
      }
  }

  function toggleHoraReservada(elemento) {
    if (elemento.classList.contains("hora-reservada")) {
      elemento.classList.remove("hora-reservada");
    } else {
      elemento.classList.add("hora-reservada");
    }
  }

  const calendarioContainer = document.querySelector('.calendario-container');
  const nombreMes = document.createElement('h2');
  let fechaActual = new Date();

  calendarioContainer.appendChild(nombreMes);

  function generarCalendario(fecha) {
    calendarioContainer.innerHTML = '';
    calendarioContainer.appendChild(nombreMes);

    const semanaInicio = new Date(fecha);
    semanaInicio.setDate(semanaInicio.getDate() - semanaInicio.getDay() + 1);

    const tabla = document.createElement('table');
    tabla.classList.add('tabla-calendario');

    const cabecera = document.createElement('tr');
    ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].forEach(dia => {
      const th = document.createElement('th');
      th.textContent = dia;
      cabecera.appendChild(th);
    });
    tabla.appendChild(cabecera);

    for (let semana = 0; semana < 2; semana++) {
      const fila = document.createElement('tr');
      for (let dia = 0; dia < 7; dia++) {
        const celda = document.createElement('td');
        celda.textContent = semanaInicio.getDate();
        celda.classList.add('dia');
        celda.addEventListener("click", () => {
            showPopup(); // Mostrar la ventana emergente al hacer clic en el día
        });
        fila.appendChild(celda);
        semanaInicio.setDate(semanaInicio.getDate() + 1);
      }
      tabla.appendChild(fila);
    }

    calendarioContainer.appendChild(tabla);

    const mesActual = fecha.toLocaleString('default', { month: 'long' });
    nombreMes.textContent = mesActual.charAt(0).toUpperCase() + mesActual.slice(1) + " " + fecha.getFullYear();
  }

  document.getElementById('prev-week').addEventListener('click', function() {
    fechaActual.setDate(fechaActual.getDate() - 14);
    generarCalendario(fechaActual);
  });

  document.getElementById('next-week').addEventListener('click', function() {
    fechaActual.setDate(fechaActual.getDate() + 14);
    generarCalendario(fechaActual);
  });

  generarCalendario(fechaActual);

  // Función para mostrar la ventana emergente
  function showPopup() {
    const popup = document.getElementById("popup");
    popup.innerHTML = ''; // Limpiamos el contenido anterior

    // Botón de cerrar (X)
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.classList.add("close");
    closeButton.addEventListener("click", () => {
      popup.style.display = "none"; // Cerrar el pop-up al hacer clic en el botón de cerrar
    });
    popup.appendChild(closeButton);

    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Aceptar";
    acceptButton.addEventListener("click", () => {
        acceptHours();});
        popup.appendChild(acceptButton);
    
        const clonedList = listaHoras.cloneNode(true);
        clonedList.querySelectorAll('.hora-item').forEach(item => {
          item.addEventListener("click", function() {
            toggleHoraReservada(this); // Alternar la reserva de la hora al hacer clic dentro del pop-up
          });
        });
        popup.appendChild(clonedList); // Agregamos la lista de horas al pop-up
        popup.style.display = "block";
      }
    function toggleHoraReservada(elemento) {
      if (elemento.classList.contains("hora-reservada")) {
        elemento.classList.remove("hora-reservada");
      } else {
        elemento.classList.add("hora-reservada");
      }
    }
    
      // Función para aceptar las horas reservadas y abrir el formulario
      function acceptHours() {
        const horasReservadas = document.querySelectorAll('.hora-reservada');
        const horasSeleccionadas = Array.from(horasReservadas).map(hora => hora.textContent);

    
        // Guardar las horas seleccionadas en el almacenamiento local
        localStorage.setItem('horasReservadas', JSON.stringify(horasSeleccionadas));

        // Redireccionar al formulario de datos
        window.location.href = 'formulario.html';
      }

//Formulario 
const tipoCorte = document.getElementById('tipo-corte');
    const precioTotal = document.getElementById('precio');
    const formulario = document.getElementById('formulario');

    const precios = {
        'corte-adulto': 12,
        'corte-niño': 9,
        'barba': 5,
        'lados': 4,
        'corte-barba': 15,
        'tinte': 28
    };

    tipoCorte.addEventListener('change', function() {
        const tipoSeleccionado = tipoCorte.value;
        const precio = precios[tipoSeleccionado] || 0;
        precioTotal.textContent = precio + '€';
    });
formulario.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el envío por defecto del formulario

  const tipoSeleccionado = tipoCorte.value;
  const precio = precios[tipoSeleccionado] || 0;

  // Guardar el precio en localStorage
  localStorage.setItem('precioCarrito', precio);

  // Redirigir a la página de pagos
  window.location.href = 'pago.html';
});

var btnPagarEfectivo = document.getElementById("btnPagarEfectivo");
var modal = document.getElementById("myModal");

// Obtener el elemento span que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario haga clic en el botón, abrir el modal
btnPagarEfectivo.onclick = function() {
  modal.style.display = "block";
}

// Cuando el usuario haga clic en <span> (x), cerrar el modal
span.onclick = function() {
  modal.style.display = "none";
}

// Cuando el usuario haga clic fuera del modal, cerrarlo
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Inicializar Google Maps
function initMap() {
    var location = {lat: -25.363, lng: 131.044}; // Coordenadas de ejemplo
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}
initMap();


});