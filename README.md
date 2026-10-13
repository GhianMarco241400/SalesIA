# SalesIA Visor

Crea SOLO la parte visual (maqueta navegable) de un sistema web empresarial. NO quiero funcionalidad real: sin backend, sin base de datos, sin autenticación real, sin llamadas a APIs. Todo con datos de ejemplo escritos directamente en el código. Los botones solo navegan entre pantallas o abren paneles y ventanas visuales. Idioma: español. Moneda: soles (S/).

CONCEPTO
Una empresa que vende a pymes peruanas páginas web y apps móviles listas para usar, en combos con nombres simples, con precio fijo mensual en soles. El sistema tiene dos partes: una vitrina pública donde el cliente elige y personaliza un combo, y un panel interno llamado "SalesIA" que usa el trabajador para revisar y confirmar pedidos, ver ventas y analizar estadísticas. El cliente nunca entra al panel.

ESTILO VISUAL
- Aspecto empresarial, sobrio y limpio, tipo software de gestión profesional (referencias: IBM Carbon, Microsoft Fluent, SAP Fiori).
- Paleta: azul corporativo como color principal, cyan como acento secundario, fondos blancos y grises con un ligero tono azul. Verde, ámbar y rojo SOLO para estados (confirmado, pendiente, rechazado, riesgo).
- Tipografía sans-serif moderna y legible. Esquinas suavemente redondeadas, sombras muy sutiles, mucho espacio en blanco.
- Tablas ordenadas, etiquetas de estado (badges) de colores, tarjetas simples, iconos de línea.
- Responsive para escritorio y tablet. Modo claro por defecto.
- Nada de gradientes llamativos, ni emojis, ni diseño recargado.

PARTE 1: VITRINA PÚBLICA (3 pantallas)
1. Inicio: encabezado con logo y menú, título claro ("Tu página web y tu app, listas para usar"), subtítulo, botón "Ver combos", tres ventajas (precio fijo en soles, boleta y pago local, soporte en español) y sección de combos.
2. Combos: 4 tarjetas con nombre, para quién es, qué incluye en palabras simples, precio mensual y pago único de armado, y botón. Combos: Arranque (página informativa, dominio, correo, respaldo), Negocio (tienda o catálogo con pedidos y panel), Crece (web + app móvil, soporte prioritario) y A medida. Interruptor visual "Sin servidor / Con servidor".
3. Personalizar y cotizar: lista de opciones ajustables (almacenamiento, app móvil, soporte, dominio) con controles, y un resumen lateral fijo con desglose: combo base, extras, costo estimado de infraestructura (con la nota "Precios de AWS actualizados al [fecha]"), precio mensual en soles, pago único y total. Botón "Contratar" que lleva a una pantalla de confirmación con el mensaje "Recibimos tu pedido".

PARTE 2: PANEL SALESIA (pantallas internas)
Barra lateral agrupada en cuatro secciones:
- Operaciones: Pedidos, Ventas, Inventario.
- Mantenimiento: Clientes, Productos (combos y extras), Proveedores.
- Análisis: Analytics, Probabilidad y Bayes, Insights, Reportes.
- Administración: Usuarios, Auditoría, Revisión con IA.
Arriba: nombre del trabajador con su rol y un menú de usuario. Incluye una pantalla de login visual simple.

Pantallas a diseñar:
1. Login (solo visual).
2. Dashboard: tarjetas con ventas del mes, ticket promedio, pedidos pendientes y clientes activos; un gráfico de líneas de ventas por periodo; un gráfico de barras por combo; una tabla corta de últimos pedidos.
3. Pedidos: tabla con número, cliente, combo, total, estado (Pendiente de revisión, En revisión, Confirmado, Rechazado) y nivel de riesgo (bajo, medio, alto), con filtros.
4. Detalle de pedido (la pantalla más importante): datos del cliente, combo y extras con precios, y un panel lateral "Revisión con IA" con un resumen en lenguaje claro, una lista de alertas resaltadas (por ejemplo "El precio difiere del precio actual de AWS", "Cliente nuevo") y un nivel de riesgo. Abajo, botones "Confirmar venta" y "Rechazar" y una casilla "Revisé los datos del pedido". Una línea de tiempo con el historial.
5. Ventas: tabla con número, cliente, vendedor, método de pago (Efectivo, Yape, Tarjeta, Transferencia), total y estado.
6. Inventario: capacidad o cupos disponibles por combo y por región, con barras de progreso y alertas de bajo cupo.
7. Clientes, Productos y Proveedores: tablas de mantenimiento con buscador, botón "Nuevo" y ventana lateral con un formulario visual.
8. Analytics: tarjetas con media (ticket promedio), mediana y cantidad de ventas; un histograma de montos; un gráfico por vendedor; filtros por periodo, vendedor y combo; y un recuadro de insight con texto como "La media es mayor que la mediana: unas pocas ventas grandes suben el promedio."
9. Probabilidad y Bayes: formulario con P(A), P(B|A) y P(B), un botón "Calcular" y un resultado con la fórmula P(A|B) = P(B|A)·P(A) / P(B) y una explicación paso a paso (valores de ejemplo).
10. Insights: lista de tarjetas con una observación y el número que la respalda.
11. Reportes: tarjetas de reportes disponibles con vista previa imprimible.
12. Revisión con IA (seguridad): lista de alertas de anomalías (descuentos fuera de lo normal, muchos intentos de ingreso fallidos, ventas fuera de horario) con severidad y evidencia.
13. Usuarios y Auditoría: tabla de usuarios con roles (Administrador, Gerente, Vendedor, Analista, Almacén) y un registro de acciones con fecha, usuario y acción.

DATOS DE EJEMPLO
Inventa clientes (empresas peruanas ficticias), 2 o 3 trabajadores, y precios razonables en soles. Marca visualmente que son datos de ejemplo. No uses logotipos ni marcas reales.

REGLAS
- Estados vacíos y de carga solo cuando aporten (por ejemplo una tabla sin resultados).
- Mantén una navegación coherente: el menú lateral lleva a cada pantalla.
- Prioriza que se vea ordenado, profesional y consistente entre pantallas.
- Usa React, TypeScript, Tailwind y componentes reutilizables.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/64e998b8-8e36-49bb-a593-f4ae3e392155).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
