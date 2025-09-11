import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const movimientosController = async () => {
  const selectTrabajador = document.querySelector("#trabajador-admin");
  const fechaInput = document.querySelector("#fecha-admin");
  const botonVerCitas = document.querySelector("#admin__boton--citas");
  const tablaBody = document.querySelector("#tabla-citas-body");

  // 🔹 Cargar lista de trabajadores
  try {
    const trabajadores = await solicitudes.get("usuarios/trabajadores"); 
    selectTrabajador.innerHTML = `<option value="">Selecciona un trabajador...</option>`;
    trabajadores.forEach(t => {
      const option = document.createElement("option");
      option.value = t.id;
      option.textContent = t.nombre;
      selectTrabajador.appendChild(option);
    });
  } catch (err) {
    error("No se pudieron cargar los trabajadores");
  }

  // 🔹 Consultar citas
  botonVerCitas.addEventListener("click", async () => {
    const idTrabajador = selectTrabajador.value;
    const fecha = fechaInput.value;

    if (!idTrabajador || !fecha) {
      error("Debes seleccionar trabajador y fecha");
      return;
    }

    try {
      const citas = await solicitudes.get(`ordenes/trabajador/${idTrabajador}/fecha/${fecha}`);

      tablaBody.innerHTML = "";

      if (citas.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="4">No hay citas para este día</td></tr>`;
        return;
      }

      citas.forEach(c => {
        // 🔹 Convertir hora a formato 12 horas con AM/PM
        let horaFormateada = c.hora;
        if (c.hora) {
          const [h, m] = c.hora.split(":");
          let horas = parseInt(h, 10);
          const minutos = m;
          const ampm = horas >= 12 ? "PM" : "AM";
          horas = horas % 12;
          horas = horas ? horas : 12; // si es 0 → 12
          horaFormateada = `${horas}:${minutos} ${ampm}`;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${horaFormateada}</td>
          <td>${c.usuario_nombre}</td>
          <td>${c.servicio_nombre}</td>
          <td>${c.estado_nombre}</td>
        `;
        tablaBody.appendChild(row);
      });
    } catch (err) {
      error("No se pudieron cargar las citas");
    }
  });
};

