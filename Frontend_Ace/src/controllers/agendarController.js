import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const agendarController = async () => {
  // Recuperamos el trabajador seleccionado
  const trabajador = JSON.parse(sessionStorage.getItem("trabajadorSeleccionado"));
  const cliente = JSON.parse(sessionStorage.getItem("usuarioLogueado")); // 👈 cliente logueado

  if (!trabajador) {
    window.location.hash = "#/cliente";
    return;
  }

  // Cargamos los datos básicos del trabajador
  document.querySelector("#id-trabajador").value = trabajador.id || "";
  document.querySelector("#campo-estilista").value = trabajador.nombre || "";
  const titulo = document.querySelector(".cuadro__titulo");
  if (titulo) titulo.textContent = `Agendar Cita con ${trabajador.nombre}`;

  // 🔹 Cargar servicios según rol del estilista
  const selectServicio = document.querySelector("#select-servicio");
  try {
    const servicios = await solicitudes.get(`servicios/rol/${trabajador.id_roles}`);
    selectServicio.innerHTML = `<option value="">Selecciona un servicio...</option>`;
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

  // 🔹 Modalidades
  const selectModalidad = document.querySelector("#modalidad");
  try {
    const modalidades = await solicitudes.get("modalidades");
    selectModalidad.innerHTML = `<option value="">Selecciona una modalidad...</option>`;
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

  // 🔹 Horarios mockeados en frontend según trabajador y fecha
  const fechaInput = document.querySelector("#fecha");
  const selectHora = document.querySelector("#hora");

  fechaInput.addEventListener("change", () => {
    const fecha = fechaInput.value;
    if (!fecha) return;

    selectHora.innerHTML = `<option value="">Selecciona una hora...</option>`;
    const horas = [];
    for (let h = 9; h <= 18; h++) {
      horas.push(`${h.toString().padStart(2, "0")}:00`);
    }
    horas.forEach(hora => {
      const option = document.createElement("option");
      option.value = hora;
      option.textContent = hora;
      selectHora.appendChild(option);
    });
  });

  // 🔹 Manejo del submit
  const form = document.querySelector(".formulario");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const hora = selectHora.value;
    const servicio = selectServicio.value;
    const modalidad = selectModalidad.value;
    const fecha = fechaInput.value;

    if (!fecha || !hora || !servicio || !modalidad) {
      error("Debes completar todos los campos");
      return;
    }

    // 👇 Objeto que se enviará al backend
    const nuevaOrden = {
        id_trabajador: trabajador.id,       // 👈 el backend espera este nombre
        id_usuario: 1,                      // 👈 aquí deberías poner el id del cliente logueado (ej: sessionStorage.getItem("usuarioId"))
        fecha: fecha,
        hora: hora,
        id_modalidad: parseInt(modalidad),
        id_servicio: parseInt(servicio),
        id_estado: 1 
    
      };

    try {
      const respuesta = await solicitudes.post("ordenes", nuevaOrden);
      console.log("✅ Orden creada:", respuesta);
      Swal.fire("Éxito", "Tu cita fue agendada correctamente", "success");
    } catch (err) {
      console.error("❌ Error al crear orden:", err);
      error("No se pudo agendar la cita");
    }
  });
};


 