import { get, put, delet } from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

export const reservasController = async () => {
  const contenedor = document.getElementById("ordenes-list");
  if (!contenedor) return;

  try {
    const cliente = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
    console.log(cliente);
    
    const ordenes = await get(`ordenes/cliente/${cliente.id}`);

    contenedor.innerHTML = "";2

    ordenes.forEach((orden) => {
      const card = document.createElement("div");
      card.className = "orden-card";

      card.innerHTML = `
        <div class="orden-card__header">
          <h3 class="orden-card__title">Orden #${orden.id}</h3>
          <span class="orden-card__estado orden-card__estado--${(orden.estado_nombre || "pendiente").toLowerCase()}">
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
          <button class="orden-card__btn orden-card__btn--pagar" data-id="${orden.id}">Pagar</button>
          <button class="orden-card__btn orden-card__btn--cancelar" data-id="${orden.id}">Cancelar</button>
          <button class="orden-card__btn orden-card__btn--productos" data-id="${orden.id}">Ver productos</button>
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

      // Ver productos
      if (btn.classList.contains("orden-card__btn--productos")) {
        const idOrden = btn.dataset.id;
        const productosDiv = document.getElementById(`productos-${idOrden}`);
        productosDiv.style.display =
          productosDiv.style.display === "none" ? "block" : "none";

        if (productosDiv.dataset.loaded) return;

        try {
          const productos = await get(`detalleOrdenProducto/orden/${idOrden}`);
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
          await put(`ordenes/${btn.dataset.id}/pagar`);
          success("✅ Orden pagada con éxito");
          ordenesClienteController(); // recargar vista
        } catch (err) {
          error("❌ Error al pagar la orden");
        }
      }

      // Cancelar
      if (btn.classList.contains("orden-card__btn--cancelar")) {
        try {
          await put(`ordenes/${btn.dataset.id}/cancelar`);
          success("⚠️ Orden cancelada");
          ordenesClienteController(); // recargar vista
        } catch (err) {
          error("❌ Error al cancelar la orden");
        }
      }
    });
  } catch (err) {
    console.error("Error cargando órdenes:", err);
    contenedor.innerHTML = "<p>Error al cargar las órdenes.</p>";
  }
};
