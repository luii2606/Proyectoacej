// import { get } from "../helpers/solicitudes.js";
// import { error, success } from "../helpers/alertas.js";

// export async function FacturaController(idOrden) {
//   try {
//     const factura = await get(`facturas/detalle/${idOrden}`);

//     if (!factura) {
//       Swal.fire("Error", "No se pudo cargar la factura", "error");
//       return;
//     }

//     // Generar HTML en pantalla
//     let productosHTML = factura.productos && factura.productos.length > 0
//       ? factura.productos.map(p => `<tr><td>${p.nombreProducto}</td><td>$${p.precio.toFixed(2)}</td></tr>`).join("")
//       : `<tr><td colspan="2">No se compraron productos</td></tr>`;

//     let html = `
//       <div class="factura">
//         <h2>Factura #${factura.idOrden}</h2>
//         <p><b>Cliente:</b> ${factura.clienteNombre}</p>
//         <p><b>Trabajador:</b> ${factura.trabajadorNombre}</p>
//         <p><b>Fecha y Hora:</b> ${factura.fechaServicio} ${factura.horaServicio}</p>
//         <p><b>Modalidad:</b> ${factura.tipoModalidad}</p>
//         <hr>
//         <p><b>Servicio Realizado:</b> ${factura.servicioNombre} - $${factura.servicioPrecio.toFixed(2)}</p>
//         <h3>Productos</h3>
//         <table border="1" cellspacing="0" cellpadding="4">
//           <thead>
//             <tr><th>Producto</th><th>Precio</th></tr>
//           </thead>
//           <tbody>
//             ${productosHTML}
//           </tbody>
//         </table>
//         <hr>
//         <h3>Total Final: $${factura.totalFinal.toFixed(2)}</h3>
//         <button id="btnImprimir" class="btn-imprimir">🖨️ Imprimir Factura</button>
//       </div>
//     `;
//     document.getElementById("contenedor-reservas").innerHTML = html;

//     // Imprimir PDF con formato profesional
//     document.getElementById("btnImprimir").addEventListener("click", () => {
//       const { jsPDF } = window.jspdf;
//       const doc = new jsPDF();

//       doc.setFontSize(18);
//       doc.text("Factura de Servicio", 80, 20);

//       doc.setFontSize(12);
//       doc.text(`Factura #${factura.idOrden}`, 20, 40);
//       doc.text(`Cliente: ${factura.clienteNombre}`, 20, 50);
//       doc.text(`Trabajador: ${factura.trabajadorNombre}`, 20, 60);
//       doc.text(`Fecha y Hora: ${factura.fechaServicio} ${factura.horaServicio}`, 20, 70);
//       doc.text(`Modalidad: ${factura.tipoModalidad}`, 20, 80);

//       // Servicio
//       doc.text("Servicio Realizado:", 20, 100);
//       doc.text(`${factura.servicioNombre} - $${factura.servicioPrecio.toFixed(2)}`, 30, 110);

//       // Tabla de productos
//       let y = 130;
//       doc.text("Productos:", 20, y);
//       y += 10;

//       if (factura.productos && factura.productos.length > 0) {
//         // Encabezado tabla
//         doc.setFont(undefined, "bold");
//         doc.text("Producto", 30, y);
//         doc.text("Precio", 150, y, { align: "right" });
//         doc.setFont(undefined, "normal");
//         y += 6;

//         factura.productos.forEach(p => {
//           doc.text(p.nombreProducto, 30, y);
//           doc.text(`$${p.precio.toFixed(2)}`, 150, y, { align: "right" });
//           y += 6;
//         });
//       } else {
//         doc.text("No se compraron productos", 30, y);
//         y += 10;
//       }

//       // Total
//       y += 10;
//       doc.setFont(undefined, "bold");
//       doc.text(`TOTAL: $${factura.totalFinal.toFixed(2)}`, 20, y);

//       doc.save(`Factura_Orden_${factura.idOrden}.pdf`);
//     });

//   } catch (err) {
//     console.error("❌ Error al cargar factura:", err);
//     Swal.fire("Error", "No se pudo cargar la factura", "error");
//   }
// }


