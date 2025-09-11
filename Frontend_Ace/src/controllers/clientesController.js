import { get, put } from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

export const ordenesTrabajadorController = async () => {
  const trabajadorId = localStorage.getItem("id_usuario"); // ✅ usar directamente
  const contenedor = document.getElementById("ordenes-trabajador-list");
  console.log(" Trabajador ID:", trabajadorId);
  
  if (!contenedor || !trabajadorId) {
    console.warn(" No hay trabajador logueado o contenedor en el DOM");
    return;
  }

  try {
    // 📌 1. Consultar órdenes del trabajador
    const ordenes = await get(`ordenes/trabajador/${trabajadorId}`);
    const estado = (orden.estado_nombre || "pendiente").toLowerCase();
    // 📌 2. Consultar estados disponibles
    const estados = await get(`ordenes/${trabajadorId}/${estado}`);

    contenedor.innerHTML = ""; // limpiar vista

    if (!ordenes.length) {
      contenedor.innerHTML =
        "<p class='text-gray-500'>No tienes órdenes asignadas</p>";
      return;
    }

    // 📌 3. Pintar las órdenes como cards
    ordenes.forEach((orden) => {
      const card = document.createElement("div");
      card.className =
        "bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200";

      card.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">Orden #${orden.id}</h3>
        <p><strong>Cliente:</strong> ${orden.usuario_nombre}</p>
        <p><strong>Servicio:</strong> ${orden.servicio_nombre}</p>
        <p><strong>Fecha:</strong> ${orden.fecha}</p>
        <p><strong>Hora:</strong> ${orden.hora}</p>
        <p><strong>Estado actual:</strong> 
          <span class="font-semibold text-blue-600">${orden.estado_nombre}</span>
        </p>
        <div id="acciones-${orden.id}" class="flex flex-wrap gap-2 mt-3"></div>
      `;

      // 📌 4. Crear botones dinámicos de estados
      const acciones = card.querySelector(`#acciones-${orden.id}`);
      estados.forEach((estado) => {
        const btn = document.createElement("button");
        btn.textContent = estado.nombre;
        btn.className =
          "px-3 py-1 rounded-lg text-white text-sm transition " +
          (estado.nombre === orden.estado_nombre
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700");

        if (estado.nombre !== orden.estado_nombre) {
          btn.addEventListener("click", async () => {
            try {
              await put(`ordenes/${orden.id}/estado`, {
                estado_nombre: estado.nombre,
              });
              success(`✅ Estado actualizado a ${estado.nombre}`);
              ordenesTrabajadorController(); // ✅ recargar lista
            } catch (err) {
              error("❌ No se pudo actualizar el estado");
              console.error(err);
            }
          });
        }

        acciones.appendChild(btn);
      });

      contenedor.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error cargando órdenes:", err);
    error("No se pudieron cargar las órdenes del trabajador");
  }
};

