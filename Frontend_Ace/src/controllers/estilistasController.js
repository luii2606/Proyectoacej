import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const estilistasController = async () => {
  const contenedor = document.querySelector("#estilistas-contenedor");

  // 🔹 Renderizar trabajadores
  const cargarTrabajadores = async () => {
    try {
      // Llamada al endpoint que devuelve los trabajadores
      const trabajadores = await solicitudes.get("usuarios/trabajadores");
      console.log("Lista trabajadores:", trabajadores);

      // Limpiar contenedor
      contenedor.innerHTML = "";

      // Recorrer y renderizar cada trabajador
      trabajadores.forEach(t => {
        const tarjeta = document.createElement("a");
        tarjeta.href = "#/agendar";
        tarjeta.className = "estilista estilista--hover";

        const nombreUsuario = t.nombre || "";
        const nombreRol = t.nombreRol || "";
        const telefono = t.telefono || "";

        tarjeta.innerHTML = `
          <div class="estilista__info">
            <div class="estilista__nombre">${nombreUsuario}</div>
            <div class="estilista__descripcion">${nombreRol}</div>
            <div class="estilista__telefono">Tel.: ${telefono}</div>
          </div>
        `;

        tarjeta.addEventListener("click", async () => {
          try {
            // Hacemos petición al backend con el id del trabajador
            const trabajadorDetalle = await solicitudes.get(`usuarios/${t.id}`);
            console.log("Detalle trabajador:", trabajadorDetalle);

            // Guardamos solo lo necesario
            const trabajadorSeleccionado = {
              id: trabajadorDetalle.id,           // id_usuario real
              nombre: trabajadorDetalle.nombre,   // nombre del trabajador
              id_roles: trabajadorDetalle.id_roles // id_roles para cargar servicios
            };

            sessionStorage.setItem("trabajadorSeleccionado", JSON.stringify(trabajadorSeleccionado));

            // Redirigir a agendar
            window.location.hash = "#/agendar";
          } catch (err) {
            console.error("Error obteniendo detalle del trabajador:", err);
            error("No se pudo obtener el rol del trabajador");
          }
        });

        contenedor.appendChild(tarjeta);
      });
    } catch (err) {
      console.error("Error cargando trabajadores:", err);
      error("No se pudieron cargar los trabajadores.");
    }
  };

  // 🔹 Inicializar
  await cargarTrabajadores();
};



