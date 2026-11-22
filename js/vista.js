import { NOMBRES_CATEGORIA } from "./datos.js";
import { redondear, calcularResumen } from "./calculos.js";

const listaCatalogo = document.querySelector("#lista-catalogo");
const catalogoVacio = document.querySelector("#catalogo-vacio");
const lineasCarrito = document.querySelector("#lineas-carrito");
const tablaCarrito = document.querySelector("#tabla-carrito");
const carritoVacio = document.querySelector("#carrito-vacio");
const botonConfirmar = document.querySelector("#btn-confirmar");
const listaPedidos = document.querySelector("#lista-pedidos");
const historialVacio = document.querySelector("#historial-vacio");

const NOMBRES_ENTREGA = {
  recogida: "Recogida",
  envio: "Envío"
};

  if (!Number.isFinite(importe)) {
    return "0.00 €";
  }
  return importe.toFixed(2) + " €";


export function crearTarjetaProducto(producto) {
  const li = document.createElement("li");
  li.className = "tarjeta";
  li.dataset.id = String(producto.id);

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const categoria = document.createElement("p");
  categoria.textContent = "Categoría: " + NOMBRES_CATEGORIA[producto.categoria];

  const precio = document.createElement("p");
  precio.textContent = "Precio: " + formatearImporte(producto.precio);

  const existencias = document.createElement("p");
  existencias.textContent = producto.stock > 0 ? "Existencias: " + producto.stock : "Agotado";

  const idCampo = "cantidad-" + producto.id;
  const etiqueta = document.createElement("label");
  etiqueta.htmlFor = idCampo;
  etiqueta.textContent = "Cantidad ";

  const cantidad = document.createElement("input");
  cantidad.type = "number";
  cantidad.id = idCampo;
  cantidad.min = "1";
  cantidad.max = String(producto.stock);
  cantidad.step = "1";
  cantidad.value = "1";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.dataset.accion = "anadir";
  boton.textContent = "Añadir al carrito";

  const aviso = document.createElement("small");
  aviso.className = "aviso";
  aviso.setAttribute("aria-live", "polite");

  if (producto.stock === 0) {
    li.classList.add("agotado");
    cantidad.disabled = true;
    boton.disabled = true;
  }

  li.append(titulo, categoria, precio, existencias, etiqueta, cantidad, " ", boton, aviso);
  return li;
}

export function renderizarCatalogo(productos) {
  listaCatalogo.textContent = "";
  productos.forEach(producto => {
    listaCatalogo.append(crearTarjetaProducto(producto));
  });
  catalogoVacio.hidden = productos.length > 0;
}

export function renderizarCarrito(carrito, catalogo) {
  lineasCarrito.textContent = "";

  carrito.forEach(linea => {
    const producto = catalogo.find(p => p.id === linea.productoId);
    if (!producto) {
      return;
    }
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = producto.nombre;
    const celdaCantidad = document.createElement("td");
    celdaCantidad.textContent = String(linea.cantidad);
    const celdaPrecio = document.createElement("td");
    celdaPrecio.textContent = formatearImporte(producto.precio);
    const celdaSubtotal = document.createElement("td");
    celdaSubtotal.textContent = formatearImporte(redondear(producto.precio * linea.cantidad));

    const celdaAccion = document.createElement("td");
    const retirar = document.createElement("button");
    retirar.type = "button";
    retirar.dataset.accion = "retirar";
    retirar.dataset.id = String(producto.id);
    retirar.textContent = "Retirar";
    celdaAccion.append(retirar);

    fila.append(celdaNombre, celdaCantidad, celdaPrecio, celdaSubtotal, celdaAccion);
    lineasCarrito.append(fila);
  });

  const vacio = carrito.length === 0;
  carritoVacio.hidden = !vacio;
  tablaCarrito.hidden = vacio;
  botonConfirmar.disabled = vacio;

  const resumen = calcularResumen(carrito, catalogo);
  document.querySelector("#resumen-unidades").textContent = String(resumen.unidades);
  document.querySelector("#resumen-subtotal").textContent = formatearImporte(resumen.subtotal);
  document.querySelector("#resumen-descuento").textContent = formatearImporte(resumen.descuento);
  document.querySelector("#resumen-total").textContent = formatearImporte(resumen.total);
}

export function crearEntradaPedido(pedido) {
  const li = document.createElement("li");
  const detalle = document.createElement("details");

  const cabecera = document.createElement("summary");
  cabecera.textContent = "Pedido nº " + pedido.id +
    " · " + new Date(pedido.fecha).toLocaleString("es-ES") +
    " · " + pedido.cliente.nombre +
    " · " + NOMBRES_ENTREGA[pedido.entrega] +
    " · " + formatearImporte(pedido.total);

  const tabla = document.createElement("table");
  const encabezado = document.createElement("tr");
  ["Producto", "Cantidad", "Precio unitario", "Importe"].forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    encabezado.append(th);
  });
  tabla.append(encabezado);

  pedido.lineas.forEach(linea => {
    const fila = document.createElement("tr");
    [linea.nombre, String(linea.cantidad), formatearImporte(linea.precio),
      formatearImporte(linea.importe)].forEach(texto => {
      const td = document.createElement("td");
      td.textContent = texto;
      fila.append(td);
    });
    tabla.append(fila);
  });

  const importes = document.createElement("p");
  importes.textContent = "Subtotal: " + formatearImporte(pedido.subtotal) +
    " · Descuento: " + formatearImporte(pedido.descuento) +
    " · Total: " + formatearImporte(pedido.total);

  detalle.append(cabecera, tabla, importes);

  if (pedido.entrega === "envio") {
    const envio = document.createElement("p");
    envio.textContent = "Envío a: " + pedido.cliente.direccion + " (" + pedido.cliente.cp + ")";
    detalle.append(envio);
  }

  li.append(detalle);
  return li;
}

export function renderizarHistorial(lista, resumen, hayPedidos) {
  listaPedidos.textContent = "";
  lista.forEach(pedido => {
    listaPedidos.append(crearEntradaPedido(pedido));
  });

  if (!hayPedidos) {
    historialVacio.textContent = "Todavía no hay pedidos confirmados.";
  } else {
    historialVacio.textContent = "Ningún pedido cumple el filtro seleccionado.";
  }
  historialVacio.hidden = lista.length > 0;

  document.querySelector("#historial-numero").textContent = String(resumen.numero);
  document.querySelector("#historial-importe").textContent = formatearImporte(resumen.importe);
}