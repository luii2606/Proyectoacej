import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const agendarController = async () => {
  const trabajador = JSON.parse(sessionStorage.getItem("trabajadorSeleccionado"));

  if (!trabajador) {
    window.location.hash = "#cliente";
    return;
  }

  document.querySelector("#id-trabajador").value = trabajador.id || "";
  document.querySelector("#campo-estilista").value = trabajador.nombre || "";
  const titulo = document.querySelector(".cuadro__titulo");
  if (titulo) titulo.textContent = `Agendar Cita con ${trabajador.nombre}`;

  // 🔹 Cargar servicios según rol del estilista
  const selectServicio = document.querySelector("#select-servicio");
  try {
    const servicios = await solicitudes.get(`servicios?rol=${trabajador.id_roles}`);
    servicios.forEach(s => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.nombre;
      selectServicio.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando servicios:", err);
    error("No se pudieron cargar los servicios");
  }

  // 🔹 Modalidades (igual para todos)
  const selectModalidad = document.querySelector("#modalidad");
  try {
    const modalidades = await solicitudes.get("modalidades");
    modalidades.forEach(m => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = m.nombre;
      selectModalidad.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando modalidades:", err);
    error("No se pudieron cargar las modalidades");
  }

  // 🔹 Horarios según trabajador y fecha
  const fechaInput = document.querySelector("#fecha");
  const selectHora = document.querySelector("#hora");

  fechaInput.addEventListener("change", async () => {
    const fecha = fechaInput.value;
    if (!fecha) return;

    selectHora.innerHTML = `<option value="">Selecciona una hora...</option>`;

    try {
      const horarios = await solicitudes.get(`horarios?trabajadorId=${trabajador.id}&fecha=${fecha}`);
      horarios.forEach(h => {
        const option = document.createElement("option");
        option.value = h.hora;
        option.textContent = h.hora;
        selectHora.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando horarios:", err);
      error("No se pudieron cargar los horarios disponibles");
    }
  });

  // 🔹 Manejo del submit
  const form = document.querySelector(".formulario");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const hora = selectHora.value;
    const servicio = selectServicio.value;
    const modalidad = selectModalidad.value;
    const fecha = fechaInput.value;

    if (!fecha || !hora || !servicio || !modalidad) {
      error("Debes completar todos los campos");
      return;
    }

    console.log({
      trabajadorId: trabajador.id,
      trabajadorNombre: trabajador.nombre,
      fecha,
      hora,
      servicio,
      modalidad
    });
  });
};



 