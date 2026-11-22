import { calcularResumen, redondear } from "./calculos.js";
import { comprobarStock } from "./validacion.js";

export function crearPedido(numero, datos, carrito, catalogo) {
  const resumen = calcularResumen(carrito, catalogo);
  const esEnvio = datos.entrega === "envio";

  const lineas = carrito.map(linea => {
    const producto = catalogo.find(p => p.id === linea.productoId);
    return {
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: linea.cantidad,
      importe: redondear(producto.precio * linea.cantidad)
    };
  });

  return {
    id: numero,
    fecha: new Date().toISOString(),
    cliente: {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      direccion: esEnvio ? datos.direccion.trim() : null,
      cp: esEnvio ? datos.cp : null
    },
    entrega: datos.entrega,
    observaciones: datos.observaciones.trim(),
    lineas: lineas,
    subtotal: resumen.subtotal,
    descuento: resumen.descuento,
    total: resumen.total
  };
}

export function confirmarPedido(datos, carrito, catalogo, pedidos) {
  if (carrito.length === 0) {
    return { ok: false, mensaje: "El carrito está vacío" };
  }
  const erroresStock = comprobarStock(carrito, catalogo);
  if (erroresStock.length > 0) {
    return { ok: false, mensaje: erroresStock.join(". ") };
  }

  const pedido = crearPedido(pedidos.length + 1, datos, carrito, catalogo);
  carrito.forEach(linea => {
    const producto = catalogo.find(p => p.id === linea.productoId);
    producto.descontar(linea.cantidad);
  });
  pedidos.push(pedido);
  carrito.splice(0, carrito.length);   

  return { ok: true, mensaje: "Pedido confirmado", pedido: pedido };
}

export function filtrarPedidos(pedidos, modalidad) {
  return pedidos.filter(pedido => modalidad === "todos" || pedido.entrega === modalidad);
}

export function resumirPedidos(lista) {
  let importe = 0;
  lista.forEach(pedido => {
    importe += pedido.total;
  });
  return { numero: lista.length, importe: redondear(importe) };
}

export function exportarPedidos(pedidos) {
  return JSON.stringify(pedidos, null, 2);
}