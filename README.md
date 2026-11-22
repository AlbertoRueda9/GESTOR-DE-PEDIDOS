# Gestor de pedidos de material

Práctica de Desarrollo Web en Entorno Cliente (sesiones 8–13). Es una aplicación web que permite consultar un catálogo, gestionar un carrito, confirmar pedidos con un formulario validado y consultar el historial. Funciona solo en el navegador, con HTML, CSS y JavaScript y sin frameworks. Los datos se guardan en memoria y se pierden al recargar.

## Estructura

```
gestor-pedidos/
├── index.html          estructura de la página
├── css/estilos.css     estilos básicos
└── js/
    ├── app.js          punto de entrada: eventos y arranque
    ├── producto.js     clase Producto
    ├── datos.js        catálogo inicial, carrito y pedidos
    ├── calculos.js     subtotal, descuento y totales
    ├── carrito.js      búsqueda en el catálogo y operaciones del carrito
    ├── validacion.js   reglas del formulario y comprobación de stock
    ├── pedidos.js      creación de pedidos e historial
    ├── vista.js        pintado del catálogo, el carrito y el historial (DOM)
    └── formulario.js   lectura y mensajes del formulario (DOM)
```

La lógica (`calculos.js`, `carrito.js`, `validacion.js` y `pedidos.js`) no usa `document`: recibe los datos por parámetro y devuelve resultados. Solo `vista.js`, `formulario.js` y `app.js` tocan el DOM.

## Funcionalidades

| Funcionalidad | Qué hace | Archivos y funciones |
|---|---|---|
| Catálogo | Muestra 7 productos de 3 categorías. Uno está agotado y se ve, pero no se puede añadir | `Producto` (`estaDisponible`, `descontar`), `crearTarjetaProducto`, `renderizarCatalogo` |
| Búsqueda y filtro | Busca por nombre sin distinguir mayúsculas y filtra por categoría. Los dos criterios se combinan | `filtrarCatalogo`, `actualizarCatalogo` |
| Carrito | Añade cantidades enteras sin superar el stock y suma cantidades si el producto ya está. La retirada de líneas usa delegación de eventos | `anadirAlCarrito`, `retirarDelCarrito`, `renderizarCarrito` |
| Cálculos | Subtotal, 10 % de descuento desde 100 € y total. Se calcula con números y solo se formatea con dos decimales al mostrar | `calcularSubtotal`, `calcularDescuento(subtotal, porcentaje = 0)`, `calcularResumen`, `formatearImporte` |
| Formulario | Usa `novalidate` y se valida en `submit` con `preventDefault`. Combina restricciones HTML5 con la Constraint Validation API (`setCustomValidity`, `checkValidity` y `reportValidity`). El código postal se comprueba con la regex `^(?:0[1-9]\|[1-4][0-9]\|5[0-2])[0-9]{3}$` | `validarDatosPedido`, `leerDatosFormulario` (FormData), `revisarFormulario`, `actualizarModalidad`, `actualizarContador` |
| Confirmación | Vuelve a comprobar el stock, crea el pedido, descuenta el stock, lo añade al historial y vacía el carrito. Si algo falla, no cambia nada | `comprobarStock`, `crearPedido`, `confirmarPedido` |
| Historial y JSON | Lista los pedidos con su detalle desplegable y permite filtrar por modalidad, con el número de pedidos y la suma calculados sobre los filtrados. El historial se puede exportar a JSON | `filtrarPedidos`, `resumirPedidos`, `exportarPedidos`, `crearEntradaPedido`, `renderizarHistorial` |

## Casos de prueba

Al recargar la página se vuelve al estado inicial.

| Caso | Pasos y datos | Resultado esperado |
|---|---|---|
| Búsqueda | Buscar `RATÓN` | Solo aparece "Ratón USB" |
| Filtro sin resultados | Buscar `ratón` y filtrar Oficina | "No hay productos que coincidan" |
| Producto agotado | Mirar el Teclado mecánico | "Agotado", con el campo y el botón desactivados |
| Cantidad inválida | Ratón con la cantidad vacía, `0` o `1.5` | "Indica una cantidad entera mayor que 0" |
| Stock insuficiente | Ratón, cantidad `9` | "Stock insuficiente: hay 8…" |
| Suma de cantidades | Añadir 2 ratones y luego 3 | Una sola línea con 5 unidades |
| Eliminación de líneas | Pulsar Retirar en una línea | La línea desaparece y se recalculan los totales |
| Carrito vacío | Retirar todas las líneas | Aparece el mensaje y Confirmar queda desactivado |
| Umbral de 100 € | 7 ratones y después 8 | 87.50 € sin descuento; 100.00 € − 10.00 € = 90.00 € |
| Formulario vacío | Confirmar sin rellenar nada | Errores en cada campo y el foco en Nombre |
| Nombre con espacios | Nombre `   ` | Error de 2 a 60 caracteres |
| Correo inválido | `ana@` | Error de formato |
| Código postal inválido | Envío con CP `53001`, `00123` o `4100A` | Error. `01001` y `41001` se aceptan |
| Cambio de modalidad | Envío con un CP erróneo y cambiar a Recogida | Los campos postales se ocultan y su error desaparece |
| Contador | Escribir "Hola" en Observaciones | `4 / 200` |
| Pedido correcto | 1 monitor, Recogida, datos válidos | "Pedido nº 1 confirmado. Total: 116.10 €"; el stock del monitor pasa de 3 a 2 |
| Historial y filtro | Un pedido de recogida y otro de envío; filtrar | Cada filtro muestra sus pedidos con su número y su suma |
| Historial sin resultados | Solo pedidos de recogida y filtrar Envío | "Ningún pedido cumple el filtro"; 0 pedidos y 0.00 € |
| Exportar JSON | Pulsar Exportar historial | Aparece el JSON en el textarea (o `[]` si no hay pedidos) |

## Evidencias de depuración

**Punto de ruptura:** en Sources se puso un punto de ruptura en `js/app.js`, en la línea `const valido = revisarFormulario(true);` del manejador `submit`. Al confirmar, la ejecución se detiene ahí. En Scope se comprobó que `e.type` es `"submit"` y que `carrito` contiene las líneas añadidas. Con Step over se vio el valor de `valido` antes de crear el pedido.

![Punto de ruptura](capturas/breakpoint.png)

**Network:** al recargar, `index.html`, `estilos.css` y los archivos `.js` se cargan por HTTP con estado 200 y sin errores 404.

![Network](capturas/network.png)

## Chat de IA

https://claude.ai/share/036e0515-e2d9-4e19-a838-0024192c4beb

