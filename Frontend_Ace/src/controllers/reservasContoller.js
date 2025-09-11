import { get, put, delet } from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

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

      // Normalizamos el estado
      const estado = (orden.estado_nombre || "pendiente").toLowerCase();

      // --- Acciones dinámicas según estado ---
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
      }

      // Siempre se puede ver productos
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
          <p><b>Hora:</b> ${orden.hora}</p>
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

    // --- Listeners ---
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

          // 🔥 Actualizar DOM directamente
          const card = btn.closest(".orden-card");
          const estadoSpan = card.querySelector(".orden-card__estado");
          estadoSpan.textContent = "Confirmada";
          estadoSpan.className =
            "orden-card__estado orden-card__estado--confirmada";

          const accionesDiv = card.querySelector(".orden-card__acciones");
          accionesDiv.innerHTML = `
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

          // 🔥 Actualizar DOM directamente
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
    });
  } catch (err) {
    console.error("Error cargando órdenes:", err);
    contenedor.innerHTML = "<p>Error al cargar las órdenes.</p>";
  }
};



