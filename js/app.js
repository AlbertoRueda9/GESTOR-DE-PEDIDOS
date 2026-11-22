import { catalogo, carrito, pedidos, CATEGORIAS } from "./datos.js";
import { filtrarCatalogo, anadirAlCarrito, retirarDelCarrito } from "./carrito.js";
import { confirmarPedido, filtrarPedidos, resumirPedidos, exportarPedidos } from "./pedidos.js";
import { MODALIDADES } from "./validacion.js";
import {
  renderizarCatalogo, renderizarCarrito, renderizarHistorial, formatearImporte
} from "./vista.js";
import {
  leerDatosFormulario, revisarFormulario, marcarVisitado,
  actualizarModalidad, actualizarContador, mostrarEstado, reiniciarFormulario
} from "./formulario.js";

const campoBusqueda = document.querySelector("#busqueda");
const filtroCategoria = document.querySelector("#filtro-categoria");
const listaCatalogo = document.querySelector("#lista-catalogo");
const lineasCarrito = document.querySelector("#lineas-carrito");
const formPedido = document.querySelector("#form-pedido");
const filtroEntrega = document.querySelector("#filtro-entrega");
const jsonExportado = document.querySelector("#json-exportado");
const estadoExportar = document.querySelector("#estado-exportar");

function actualizarCatalogo() {
  let categoria = filtroCategoria.value;
  if (categoria !== "todas" && !CATEGORIAS.includes(categoria)) {
    categoria = "todas";
  }
  renderizarCatalogo(filtrarCatalogo(catalogo, campoBusqueda.value, categoria));
}


function actualizarHistorial() {
 
  let modalidad = filtroEntrega.value;
  if (modalidad !== "todos" && !MODALIDADES.includes(modalidad)) {
    modalidad = "todos";
  }
  const visibles = filtrarPedidos(pedidos, modalidad);
  renderizarHistorial(visibles, resumirPedidos(visibles), pedidos.length > 0);
}

campoBusqueda.addEventListener("input", actualizarCatalogo);
filtroCategoria.addEventListener("change", actualizarCatalogo);

listaCatalogo.addEventListener("click", e => {
  if (!(e.target instanceof Element)) return;
  const boton = e.target.closest('button[data-accion="anadir"]');
  if (!boton || !listaCatalogo.contains(boton)) return;

  const tarjeta = boton.closest("li");
  const producto = catalogo.find(p => p.id === Number(tarjeta.dataset.id));
  if (!producto) return;

  const campo = tarjeta.querySelector('input[type="number"]');
  const aviso = tarjeta.querySelector(".aviso");
  const resultado = anadirAlCarrito(carrito, producto, campo.valueAsNumber);

  aviso.textContent = resultado.mensaje;
  aviso.classList.toggle("ok", resultado.ok);
  if (resultado.ok) {
    renderizarCarrito(carrito, catalogo);
  }
});


lineasCarrito.addEventListener("click", e => {
  if (!(e.target instanceof Element)) return;
  const boton = e.target.closest('button[data-accion="retirar"]');
  if (!boton || !lineasCarrito.contains(boton)) return;

  retirarDelCarrito(carrito, Number(boton.dataset.id));
  renderizarCarrito(carrito, catalogo);
});

function revisarEdicion(e) {
  if (!(e.target instanceof Element) || !e.target.name) return;
  marcarVisitado(e.target.name);
  if (e.target.name === "entrega") actualizarModalidad();
  if (e.target.name === "observaciones") actualizarContador();
  mostrarEstado("");
  revisarFormulario();
}
formPedido.addEventListener("input", revisarEdicion);
formPedido.addEventListener("change", revisarEdicion);

formPedido.addEventListener("submit", e => {
  e.preventDefault();
  const valido = revisarFormulario(true);   

  if (carrito.length === 0) {
    mostrarEstado("El carrito está vacío: añade productos antes de confirmar");
    return;
  }
  if (!valido) {
    formPedido.reportValidity();
    mostrarEstado("Revisa los campos marcados antes de confirmar");
    return;
  }

  const resultado = confirmarPedido(leerDatosFormulario(), carrito, catalogo, pedidos);
  if (!resultado.ok) {
    mostrarEstado(resultado.mensaje);
    return;
  }

  renderizarCarrito(carrito, catalogo);
  actualizarCatalogo();
  actualizarHistorial();
  reiniciarFormulario();
  mostrarEstado("Pedido nº " + resultado.pedido.id + " confirmado. Total: " +
    formatearImporte(resultado.pedido.total), true);
});


filtroEntrega.addEventListener("change", actualizarHistorial);

document.querySelector("#btn-exportar").addEventListener("click", () => {
  jsonExportado.value = exportarPedidos(pedidos);
  if (pedidos.length === 0) {
    estadoExportar.textContent = "No hay pedidos que exportar: el historial está vacío.";
  } else {
    estadoExportar.textContent = "Historial exportado (" + pedidos.length + " pedidos). Puedes copiar el texto.";
    jsonExportado.select();
  }
});

actualizarCatalogo();
renderizarCarrito(carrito, catalogo);
actualizarModalidad();
actualizarContador();
actualizarHistorial();