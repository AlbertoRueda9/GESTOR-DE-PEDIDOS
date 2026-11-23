export const PORCENTAJE_DESCUENTO = 10;
export const UMBRAL_DESCUENTO = 100;   // subtotal mínimo (€) para aplicar el descuento


export function redondear(importe) {
  return Math.round(importe * 100) / 100;
}


export function calcularSubtotal(carrito, catalogo) {
  let subtotal = 0;
  carrito.forEach(linea => {
    const producto = catalogo.find(p => p.id === linea.productoId);
    if (producto) {
      subtotal += producto.precio * linea.cantidad;
    }
  });
  return redondear(subtotal);
}


export function calcularDescuento(subtotal, porcentaje = 0) {
  if (subtotal >= UMBRAL_DESCUENTO) {
    return redondear(subtotal * porcentaje / 100);
  }
  return 0;
}


export function calcularUnidades(carrito) {
  let unidades = 0;
  carrito.forEach(linea => {
    unidades += linea.cantidad;
  });
  return unidades;
}

export function calcularResumen(carrito, catalogo) {
  const subtotal = calcularSubtotal(carrito, catalogo);
  const descuento = calcularDescuento(subtotal, PORCENTAJE_DESCUENTO);
  return {
    unidades: calcularUnidades(carrito),
    subtotal: subtotal,
    descuento: descuento,
    total: redondear(subtotal - descuento)
  };
}
