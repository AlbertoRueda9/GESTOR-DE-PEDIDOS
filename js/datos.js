export const CATEGORIAS = ["perifericos", "almacenamiento", "oficina"];

export const NOMBRES_CATEGORIA = {
  perifericos: "Periféricos",
  almacenamiento: "Almacenamiento",
  oficina: "Oficina"
};

const datosProductos = [
  { id: 101, nombre: "Ratón USB", categoria: "perifericos", precio: 12.5, stock: 8 },
  { id: 102, nombre: "Teclado mecánico", categoria: "perifericos", precio: 49.9, stock: 0 },
  { id: 103, nombre: "Monitor 24 pulgadas", categoria: "perifericos", precio: 129, stock: 3 },
  { id: 201, nombre: "Memoria USB 64 GB", categoria: "almacenamiento", precio: 9.95, stock: 20 },
  { id: 202, nombre: "Disco SSD 1 TB", categoria: "almacenamiento", precio: 69.9, stock: 5 },
  { id: 301, nombre: "Paquete de folios A4", categoria: "oficina", precio: 4.5, stock: 50 },
  { id: 302, nombre: "Grapadora", categoria: "oficina", precio: 7.25, stock: 10 }
];


export const catalogo = datosProductos.map(
  datos => new Producto(datos.id, datos.nombre, datos.categoria, datos.precio, datos.stock)
);

export const carrito = [];   // líneas { productoId, cantidad }
export const pedidos = [];   // pedidos confirmados