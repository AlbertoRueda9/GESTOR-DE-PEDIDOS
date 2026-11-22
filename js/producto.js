export class Producto {
  constructor(id, nombre, categoria, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
  }

  estaDisponible(cantidad) {
    return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= this.stock;
  }

  descontar(cantidad) {
    if (!this.estaDisponible(cantidad)) {
      return false;
    }
    this.stock -= cantidad;
    return true;
  }
}