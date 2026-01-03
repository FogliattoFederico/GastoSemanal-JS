//variables
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");
const presupuestoId = document.querySelector("#presupuesto");
const contenedor = document.querySelector("#contenedor");
const gastos = document.querySelector("#gastos");

//event listeners
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", () => {
    formulario.querySelector('button[type="submit"]').disabled = true;
    formulario.querySelector('#gasto').disabled = true;
    formulario.querySelector('#cantidad').disabled = true;
  });
  document
    .querySelector("#btnPresupuesto")
    .addEventListener("click", preguntarPresupuesto);
  document.addEventListener("submit", agregarGasto);
}

//clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  agregarGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    console.log(this.gastos);
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    //extrayendo los valores
    const { presupuesto, restante } = cantidad;

    //agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo, padre, hijoReferencia) {
    //crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //mensaje de error
    divMensaje.textContent = mensaje;

    //insertar en el HTML
    document.querySelector(padre).insertBefore(divMensaje, hijoReferencia);

    //deshabilitar el boton de agregar gasto
    formulario.querySelector('button[type="submit"]').disabled = true;

    //deshabilitar el boton de presupuesto
    const btnPresupuesto = document.querySelector("#btnPresupuesto");
    btnPresupuesto.disabled = true;

    //quitar el alert despues de 3 segundos
    setTimeout(() => {
      divMensaje.remove();
      formulario.querySelector('button[type="submit"]').disabled = false;
      btnPresupuesto.disabled = false;
    }, 3000);
  }

  mostrarGastos(gastos) {
    //limpiar el HTML
    this.limpiarHTML();

    //agregar los gastos al HTML
    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;

      //crear un li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.setAttribute("data-id", id);

      //insertar el gasto
      nuevoGasto.innerHTML = `
                ${nombre}
                <span class="badge badge-primary badge-pill">$${cantidad}</span>
            `;

      //boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      //btnBorrar.textContent = 'Borrar';
      btnBorrar.innerHTML = "Borrar &times;";
      btnBorrar.onclick = () => {
        {
          eliminarGasto(id);
        }
      };
      nuevoGasto.appendChild(btnBorrar);

      //insertar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    const spanRestante = document.querySelector("#restante");
    const pRestante = document.querySelector(".restante p");

    if (restante < 0) {
      // Mantener la estructura HTML
      pRestante.innerHTML = `Faltante: $ <span id="restante">${restante}</span>`;
    } else {
      spanRestante.textContent = restante;
      pRestante.innerHTML = `Restante: $ <span id="restante">${restante}</span>`;
    }
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");
    //comprobar el 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    //si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta(
        "El presupuesto se ha agotado",
        "error",
        ".secundario",
        gastos
      );

      setTimeout(() => {
        formulario.querySelector('button[type="submit"]').disabled = true;
      }, 3000);
      
    } else {
      formulario.querySelector('button[type="submit"]').disabled = false;
      
     
    }
  }
}
//INSTANCIAR
const ui = new UI();

let presupuesto;

//FUNCIONES
//preguntar presupuesto del usuario
function preguntarPresupuesto() {
  //const presupuestoUsuario = prompt("¿Cual es tu presupuesto semanal?");
  const presupuestoUsuario = document.querySelector(
    "#presupuestoUsuario"
  ).value;

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    ui.imprimirAlerta(
      "Presupuesto no valido",
      "error",
      ".contenido-principal",
      contenedor
    );
    return;
  }

  formulario.querySelector('button[type="submit"]').disabled = false;
  formulario.querySelector('#gasto').disabled = false;
  formulario.querySelector('#cantidad').disabled = false;
  
  presupuesto = new Presupuesto(presupuestoUsuario);

  ui.insertarPresupuesto(presupuesto);
}
//agregar gastos
function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta(
      "Ambos campos son obligatorios",
      "error",
      ".primario",
      formulario
    );
    return;
  }

  if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error", ".primario", formulario);
    return;
  }

  const gasto = { nombre, cantidad, id: Date.now() };

  //añadir nuevo gaso
  presupuesto.agregarGasto(gasto);

  //mensaje de todo bien
  ui.imprimirAlerta(
    "Gasto agregado correctamente",
    "exito",
    ".primario",
    formulario
  );

  //mostrar gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  //actualizar restante
  ui.actualizarRestante(restante);

  //comprobar presupuesto
  ui.comprobarPresupuesto(presupuesto);

  //reiniciar el formulario
  formulario.reset();
}
//eliminar gasto
function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
