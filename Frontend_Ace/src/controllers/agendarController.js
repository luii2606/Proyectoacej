import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const agendarController = async () => {
  // 🔹 Recuperamos el trabajador seleccionado y cliente logueado
  const trabajador = JSON.parse(sessionStorage.getItem("trabajadorSeleccionado"));
  const cliente = JSON.parse(sessionStorage.getItem("usuarioLogueado")); 
  const clientee = localStorage.getItem("id_usuario");

  console.log("Trabajador en sessionStorage:", trabajador);
  console.log("Cliente en sessionStorage:", cliente);

  if (!trabajador) {
    window.location.hash = "#/cliente";
    return;
  }

  // 🔹 Cargamos datos del trabajador en el formulario
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

  // 🔹 Cargar modalidades
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

  // 🔹 Horarios según fecha
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

    if (!trabajador || !cliente) {
      error("Faltan datos del trabajador o del cliente");
      return;
    }

    const hora = selectHora.value;
    const servicio = selectServicio.value;
    const modalidad = selectModalidad.value;
    const fecha = fechaInput.value;

    if (!fecha || !hora || !servicio || !modalidad) {
      error("Debes completar todos los campos");
      return;
    }

    // 👇 Recuperar productos seleccionados de localStorage
    const productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

    // 👇 Objeto final que se enviará al backend
    const nuevaOrden = {
      id_trabajador: trabajador.id,   // id_usuario del trabajador
      id_usuario: clientee,           // id_usuario del cliente
      id_servicio: servicio,
      id_modalidad: modalidad,
      fecha,
      hora,
      productos: productosSeleccionados // opcionales
    };

    try {
      const respuesta = await solicitudes.post("ordenes", nuevaOrden);
      console.log("✅ Orden creada:", respuesta);

      // limpiar productos seleccionados tras enviar
      localStorage.removeItem("productosSeleccionados");

      Swal.fire("Éxito", "Tu cita fue agendada correctamente", "success");
    } catch (err) {
      console.error("❌ Error al crear orden:", err);
      error("No se pudo agendar la cita");
    }
  });
};





 