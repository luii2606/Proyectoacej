import { get, put, delet } from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

// 👉 Función para convertir hora militar a formato 12h AM/PM
function formatearHora(hora) {
  if (!hora) return "";
  const [h, m] = hora.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export const reservasController = async () => {
  const clienteId = localStorage.getItem("id_usuario");
  const contenedor = document.getElementById("ordenes-list");
  if (!contenedor) return;

  console.log("Cliente ID:", clienteId);

  try {
    let respuesta = await get(`ordenes/cliente/${clienteId}`);
    console.log("Respuesta cruda del backend:", respuesta);

    let ordenes = [];
    if (Array.isArray(respuesta)) {
      ordenes = respuesta;
    } else if (respuesta && Array.isArray(respuesta.ordenes)) {
      ordenes = respuesta.ordenes;
    }

    contenedor.innerHTML = "";

    if (!ordenes || ordenes.length === 0) {
      contenedor.innerHTML =
        "<p class='ordenes-vacias'>No tienes órdenes registradas.</p>";
      return;
    }

    ordenes.forEach((orden) => {
      const card = document.createElement("div");
      card.className = "orden-card";

      const estado = (orden.estado_nombre || "pendiente").toLowerCase();

      let accionesHTML = "";
      if (estado === "pendiente") {
        accionesHTML = `
          <button class="orden-card__btn orden-card__btn--pagar" data-id="${orden.id}">Pagar</button>
          <button class="orden-card__btn orden-card__btn--cancelar" data-id="${orden.id}">Cancelar</button>
        `;
      } else if (estado === "cancelada") {
        accionesHTML = `
          <button class="orden-card__btn orden-card__btn--eliminar" data-id="${orden.id}">Eliminar</button>
        `;
      } else if (estado === "confirmada") {
        accionesHTML = `
          <button class="orden-card__btn orden-card__btn--ver-factura" data-id="${orden.id}">Ver Factura</button>
        `;
      }

      accionesHTML += `
        <button class="orden-card__btn orden-card__btn--productos" data-id="${orden.id}">Ver productos</button>
      `;

      card.innerHTML = `
        <div class="orden-card__header">
          <h3 class="orden-card__title">Orden #${orden.id}</h3>
          <span class="orden-card__estado orden-card__estado--${estado}">
            ${orden.estado_nombre || "pendiente"}
          </span>
        </div>

        <div class="orden-card__info">
          <p><b>Fecha:</b> ${orden.fecha}</p>
          <p><b>Hora:</b> ${formatearHora(orden.hora)}</p>
          <p><b>Servicio:</b> ${orden.servicio_nombre}</p>
          <p><b>Trabajador:</b> ${orden.trabajador_nombre}</p>
        </div>

        <div class="orden-card__acciones">
          ${accionesHTML}
        </div>

        <div class="orden-card__productos" id="productos-${orden.id}" style="display:none">
          <p class="orden-card__productos-text">Cargando productos...</p>
        </div>
      `;

      contenedor.appendChild(card);
    });

    // ================== Listeners ==================
    contenedor.addEventListener("click", async (e) => {
      const btn = e.target;
      const idOrden = btn.dataset.id;

      // Ver productos
      if (btn.classList.contains("orden-card__btn--productos")) {
        const productosDiv = document.getElementById(`productos-${idOrden}`);
        productosDiv.style.display =
          productosDiv.style.display === "none" ? "block" : "none";

        if (productosDiv.dataset.loaded) return;

        try {
          const respuestaProd = await get(
            `detalleOrdenProducto/orden/${idOrden}`
          );
          let productos = [];
          if (Array.isArray(respuestaProd)) {
            productos = respuestaProd;
          } else if (respuestaProd && Array.isArray(respuestaProd.productos)) {
            productos = respuestaProd.productos;
          }

          if (!productos || productos.length === 0) {
            productosDiv.innerHTML = `<p class="orden-card__productos-empty">No compraste productos</p>`;
          } else {
            productosDiv.innerHTML = `
              <ul class="orden-card__productos-list">
                ${productos
                  .map(
                    (p) =>
                      `<li class="orden-card__producto">${p.nombre_producto} (x${p.cantidad}) - $${p.precio}</li>`
                  )
                  .join("")}
              </ul>
            `;
          }
          productosDiv.dataset.loaded = true;
        } catch (err) {
          productosDiv.innerHTML = `<p class="orden-card__productos-error">Error al cargar productos</p>`;
        }
      }

      // Pagar
      if (btn.classList.contains("orden-card__btn--pagar")) {
        try {
          await put(`ordenes/${idOrden}/pagar`);
          success("✅ Orden pagada con éxito");

          const card = btn.closest(".orden-card");
          const estadoSpan = card.querySelector(".orden-card__estado");
          estadoSpan.textContent = "Confirmada";
          estadoSpan.className =
            "orden-card__estado orden-card__estado--confirmada";

          const accionesDiv = card.querySelector(".orden-card__acciones");
          accionesDiv.innerHTML = `
            <button class="orden-card__btn orden-card__btn--ver-factura" data-id="${idOrden}">
              Ver Factura
            </button>
            <button class="orden-card__btn orden-card__btn--productos" data-id="${idOrden}">
              Ver productos
            </button>
          `;
        } catch (err) {
          error("❌ Error al pagar la orden");
        }
      }

      // Cancelar
      if (btn.classList.contains("orden-card__btn--cancelar")) {
        try {
          await put(`ordenes/${idOrden}/cancelar`);
          success("⚠️ Orden cancelada");

          const card = btn.closest(".orden-card");
          const estadoSpan = card.querySelector(".orden-card__estado");
          estadoSpan.textContent = "Cancelada";
          estadoSpan.className =
            "orden-card__estado orden-card__estado--cancelada";

          const accionesDiv = card.querySelector(".orden-card__acciones");
          accionesDiv.innerHTML = `
            <button class="orden-card__btn orden-card__btn--eliminar" data-id="${idOrden}">
              Eliminar
            </button>
            <button class="orden-card__btn orden-card__btn--productos" data-id="${idOrden}">
              Ver productos
            </button>
          `;
        } catch (err) {
          error("❌ Error al cancelar la orden");
        }
      }

      // Eliminar
      if (btn.classList.contains("orden-card__btn--eliminar")) {
        try {
          await delet(`ordenes/${idOrden}`);
          success("🗑️ Orden eliminada del historial y de la base de datos");

          const card = btn.closest(".orden-card");
          card.remove();
        } catch (err) {
          error("❌ Error al eliminar la orden");
        }
      }

      // ================== Ver Factura ==================
      if (btn.classList.contains("orden-card__btn--ver-factura")) {
        try {
          const factura = await get(`facturas/orden/${idOrden}`);

          const htmlFactura = `
            <div style="text-align:left">
              <p><b>Cliente:</b> ${factura.clienteNombre}</p>
              <p><b>Trabajador:</b> ${factura.trabajadorNombre}</p>
              <p><b>Servicio:</b> ${factura.servicioNombre} ($${factura.servicioPrecio})</p>
              <p><b>Total:</b> $${factura.totalFinal}</p>
            </div>
          `;

          Swal.fire({
            title: `Factura de Orden #${idOrden}`,
            html: htmlFactura,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "⬇️ Descargar PDF",
            cancelButtonText: "Cerrar",
          }).then((result) => {
            if (result.isConfirmed) {
              try {
                // ✅ Generar PDF con jsPDF en frontend
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.text("Factura de Servicio", 105, 20, { align: "center" });

                doc.setLineWidth(0.5);
                doc.line(20, 25, 190, 25);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(12);
                doc.text(`N° Orden: ${idOrden}`, 20, 40);
                doc.text(`Cliente: ${factura.clienteNombre}`, 20, 50);
                doc.text(`Trabajador: ${factura.trabajadorNombre}`, 20, 60);

                doc.setFont("helvetica", "bold");
                doc.text("Detalle del Servicio", 20, 80);

                doc.setFont("helvetica", "normal");
                doc.text(`Servicio: ${factura.servicioNombre}`, 20, 90);
                doc.text(`Precio Servicio: $${factura.servicioPrecio}`, 20, 100);

                doc.setLineWidth(0.3);
                doc.line(20, 110, 190, 110);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.text(`Total a pagar: $${factura.totalFinal}`, 20, 125);

                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                doc.text("Gracias por confiar en nuestros servicios ❤️", 105, 280, {
                  align: "center",
                });

                doc.save(`factura_${idOrden}.pdf`);
              } catch (err) {
                error("❌ No se pudo generar el PDF");
              }
            }
          });
        } catch (err) {
          error("❌ No se pudo cargar la factura");
        }
      }
    });
  } catch (err) {
    console.error("Error cargando órdenes:", err);
    contenedor.innerHTML = "<p>Error al cargar las órdenes.</p>";
  }
};



