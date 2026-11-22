export const MODALIDADES = ["recogida", "envio"];
export const PATRON_CP = /^(?:0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;

export function validarDatosPedido(datos) {
  const errores = {};

  const nombre = datos.nombre.trim();
  if (nombre.length < 2 || nombre.length > 60) {
    errores.nombre = "Escribe entre 2 y 60 caracteres (sin contar espacios al principio y al final)";
  }

  if (datos.correo.trim() === "") {
    errores.correo = "El correo es obligatorio";
  }

  if (!MODALIDADES.includes(datos.entrega)) {
    errores.entrega = "Elige recogida o envío";
  }

  if (datos.entrega === "envio") {
    const direccion = datos.direccion.trim();
    if (direccion.length < 5 || direccion.length > 100) {
      errores.direccion = "Escribe una dirección de 5 a 100 caracteres";
    }
    if (!PATRON_CP.test(datos.cp)) {
      errores.cp = "Escribe 5 cifras; las dos primeras (provincia) entre 01 y 52";
    }
  }

  if (datos.observaciones.length > 200) {
    errores.observaciones = "Las observaciones no pueden superar 200 caracteres";
  }

  if (datos.acepto !== true) {
    errores.acepto = "Debes confirmar los datos del pedido";
  }

  return errores;
}

export function comprobarStock(carrito, catalogo) {
  const errores = [];
  carrito.forEach(linea => {
    const producto = catalogo.find(p => p.id === linea.productoId);
    if (!producto) {
      errores.push("El producto " + linea.productoId + " ya no existe");
    } else if (!producto.estaDisponible(linea.cantidad)) {
      errores.push("Stock insuficiente de " + producto.nombre + ": quedan " + producto.stock);
    }
  });
  return errores;
}