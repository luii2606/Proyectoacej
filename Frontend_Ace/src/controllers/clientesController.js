import { get, put, delet } from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

export const ordenesTrabajadorController = async () => {
  const trabajadorId = localStorage.getItem("id_usuario");
  const contenedor = document.getElementById("ordenes-trabajador-list");
  console.log("Trabajador ID:", trabajadorId);

  if (!contenedor || !trabajadorId) {
    console.warn("⚠️ No hay trabajador logueado o contenedor en el DOM");
    return;
  }

  try {
    // 📌 1. Consultar órdenes del trabajador
    let respuesta = await get(`ordenes/trabajador/${trabajadorId}`);
    console.log("Respuesta cruda backend:", respuesta);

    let ordenes = [];
    if (Array.isArray(respuesta)) {
      ordenes = respuesta;
    } else if (respuesta && Array.isArray(respuesta.ordenes)) {
      ordenes = respuesta.ordenes;
    }

    contenedor.innerHTML = "";

    if (!ordenes || ordenes.length === 0) {
      contenedor.innerHTML =
        "<p class='ordenes-vacias'>No tienes órdenes asignadas.</p>";
      return;
    }

    // 📌 2. Pintar órdenes con estilo de cliente
    ordenes.forEach((orden) => {
      const card = document.createElement("div");
      card.className = "orden-card";

      const estado = (orden.estado_nombre || "pendiente").toLowerCase();

      // 🔹 Convertir hora a formato 12 horas con AM/PM
      let horaFormateada = orden.hora;
      if (orden.hora) {
        const [h, m] = orden.hora.split(":");
        let horas = parseInt(h, 10);
        const minutos = m.padStart(2, "0");
        const ampm = horas >= 12 ? "PM" : "AM";
        horas = horas % 12;
        horas = horas ? horas : 12; // 0 -> 12
        horaFormateada = `${horas}:${minutos} ${ampm}`;
      }

      // --- Acciones dinámicas según estado ---
      let accionesHTML = "";
      if (estado === "pendiente") {
        accionesHTML = `
          <button class="orden-card__btn orden-card__btn--cancelar" data-id="${orden.id}">
            Cancelar
          </button>
        `;
      } else if (estado === "confirmada") {
        accionesHTML = `
          <button class="orden-card__btn orden-card__btn--completar" data-id="${orden.id}">
            Completar
          </button>
        `;
      } else if (estado === "cancelada") {
        accionesHTML = `
          <button class="orden-card__btn orden-card__btn--eliminar" data-id="${orden.id}">
            Eliminar
          </button>
        `;
      }

      card.innerHTML = `
        <div class="orden-card__header">
          <h3 class="orden-card__title">Orden #${orden.id}</h3>
          <span class="orden-card__estado orden-card__estado--${estado}">
            ${orden.estado_nombre || "Pendiente"}
          </span>
        </div>

        <div class="orden-card__info">
          <p><b>Cliente:</b> ${orden.usuario_nombre}</p>
          <p><b>Servicio:</b> ${orden.servicio_nombre}</p>
          <p><b>Fecha:</b> ${orden.fecha}</p>
          <p><b>Hora:</b> ${horaFormateada}</p>
        </div>

        <div class="orden-card__acciones">
          ${accionesHTML}
        </div>
      `;

      contenedor.appendChild(card);
    });

    // 📌 3. Listeners para acciones
    contenedor.addEventListener("click", async (e) => {
      const btn = e.target;
      const idOrden = btn.dataset.id;

      // Cancelar
      if (btn.classList.contains("orden-card__btn--cancelar")) {
        try {
          await put(`ordenes/${idOrden}/estado`, {
            estado_nombre: "Cancelada",
          });
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
          `;
        } catch (err) {
          error("❌ Error al cancelar la orden");
          console.error(err);
        }
      }

      // Completar
      if (btn.classList.contains("orden-card__btn--completar")) {
        try {
          await put(`ordenes/${idOrden}/estado`, {
            estado_nombre: "Completada",
          });
          success("✅ Orden completada con éxito");

          const card = btn.closest(".orden-card");
          const estadoSpan = card.querySelector(".orden-card__estado");
          estadoSpan.textContent = "Completada";
          estadoSpan.className =
            "orden-card__estado orden-card__estado--completada";

          const accionesDiv = card.querySelector(".orden-card__acciones");
          accionesDiv.innerHTML = `
            <button class="orden-card__btn orden-card__btn--eliminar" data-id="${idOrden}">
              Eliminar
            </button>
          `;
        } catch (err) {
          error("❌ Error al completar la orden");
          console.error(err);
        }
      }

      // Eliminar
      if (btn.classList.contains("orden-card__btn--eliminar")) {
        try {
          await delet(`ordenes/${idOrden}`);
          success("🗑️ Orden eliminada correctamente");

          const card = btn.closest(".orden-card");
          card.remove();
        } catch (err) {
          error("❌ Error al eliminar la orden");
          console.error(err);
        }
      }
    });
  } catch (err) {
    console.error("❌ Error cargando órdenes:", err);
    contenedor.innerHTML = "<p>Error al cargar las órdenes.</p>";
    error("No se pudieron cargar las órdenes del trabajador");
  }
};

