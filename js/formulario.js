import { validarDatosPedido } from "./validacion.js";

const form = document.querySelector("#form-pedido");
const datosEnvio = document.querySelector("#datos-envio");
const campoDireccion = form.elements.namedItem("direccion");
const campoCp = form.elements.namedItem("cp");
const campoObservaciones = form.elements.namedItem("observaciones");
const contador = document.querySelector("#contador");
const estado = document.querySelector("#estado-pedido");

const controles = {
  nombre: form.elements.namedItem("nombre"),
  correo: form.elements.namedItem("correo"),
  entrega: form.querySelector('input[name="entrega"]'),
  direccion: campoDireccion,
  cp: campoCp,
  observaciones: campoObservaciones,
  acepto: form.elements.namedItem("acepto")
};

const visitados = new Set();

function leerTexto(datos, nombre) {
  const valor = datos.get(nombre);
  return typeof valor === "string" ? valor : "";
}

export function leerDatosFormulario() {
  const datos = new FormData(form);
  return {
    nombre: leerTexto(datos, "nombre"),
    correo: leerTexto(datos, "correo"),
    entrega: leerTexto(datos, "entrega"),
    direccion: leerTexto(datos, "direccion"),
    cp: leerTexto(datos, "cp"),
    observaciones: leerTexto(datos, "observaciones"),
    acepto: datos.has("acepto")
  };
}

export function revisarFormulario(todos = false) {
  const errores = validarDatosPedido(leerDatosFormulario());

  for (const nombre in controles) {
    controles[nombre].setCustomValidity(errores[nombre] || "");
  }

  for (const nombre in controles) {
    if (!todos && !visitados.has(nombre)) {
      continue;
    }
    const control = controles[nombre];
    document.querySelector("#e-" + nombre).textContent = control.validationMessage;
    control.setAttribute("aria-invalid", String(!control.validity.valid));
  }

  return form.checkValidity();
}

export function marcarVisitado(nombre) {
  if (nombre in controles) {
    visitados.add(nombre);
  }
}

export function actualizarModalidad() {
  const esEnvio = form.elements.namedItem("entrega").value === "envio";
  datosEnvio.hidden = !esEnvio;

  for (const campo of [campoDireccion, campoCp]) {
    campo.disabled = !esEnvio;
    campo.required = esEnvio;
    if (!esEnvio) {
      campo.setCustomValidity("");
      campo.removeAttribute("aria-invalid");
      document.querySelector("#e-" + campo.name).textContent = "";
      visitados.delete(campo.name);
    }
  }
}

export function actualizarContador() {
  contador.textContent = campoObservaciones.value.length + " / 200";
}

export function mostrarEstado(texto, ok = false) {
  estado.textContent = texto;
  estado.classList.toggle("ok", ok);
}

export function reiniciarFormulario() {
  form.reset();
  visitados.clear();
  for (const nombre in controles) {
    controles[nombre].setCustomValidity("");
    controles[nombre].removeAttribute("aria-invalid");
    document.querySelector("#e-" + nombre).textContent = "";
  }
  actualizarModalidad();
  actualizarContador();
}