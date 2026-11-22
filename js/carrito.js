export function filtrarCatalogo(catalogo, texto, categoria) {
  const buscado = texto.trim().toLowerCase();
  return catalogo.filter(producto => {
    const coincideNombre = producto.nombre.toLowerCase().includes(buscado);
    const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });
}


export function anadirAlCarrito(carrito, producto, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { ok: false, mensaje: "Indica una cantidad entera mayor que 0" };
  }
  const linea = carrito.find(l => l.productoId === producto.id);
  const yaEnCarrito = linea ? linea.cantidad : 0;
  if (!producto.estaDisponible(yaEnCarrito + cantidad)) {
    return {
      ok: false,
      mensaje: "Stock insuficiente: hay " + producto.stock + " y ya tienes " + yaEnCarrito + " en el carrito"
    };
  }
  if (linea) {
    linea.cantidad += cantidad;
  } else {
    carrito.push({ productoId: producto.id, cantidad: cantidad });
  }
  return { ok: true, mensaje: "Añadido al carrito" };
}

export function retirarDelCarrito(carrito, productoId) {
  const linea = carrito.find(l => l.productoId === productoId);
  if (!linea) {
    return false;
  }
  carrito.splice(carrito.indexOf(linea), 1);
  return true;
}