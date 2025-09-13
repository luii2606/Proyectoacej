// agendarController.js
import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const agendarController = async () => {
  const trabajador = JSON.parse(sessionStorage.getItem("trabajadorSeleccionado"));
  const cliente = JSON.parse(sessionStorage.getItem("usuarioLogueado")); 
  const idCliente = localStorage.getItem("id_usuario");

  console.log("Trabajador en sessionStorage:", trabajador);
  console.log("Cliente en sessionStorage:", cliente);

  if (!trabajador) {
    window.location.hash = "#/cliente";
    return;
  }

  // Mostrar datos del trabajador en el formulario
  document.querySelector("#id-trabajador").value = trabajador.id || "";
  document.querySelector("#campo-estilista").value = trabajador.nombre || "";
  const titulo = document.querySelector(".cuadro__titulo");
  if (titulo) titulo.textContent = `Agendar Cita con ${trabajador.nombre}`;

  // --- Servicios ---
  const selectServicio = document.querySelector("#select-servicio");
  try {
    const servicios = await solicitudes.get(`servicios/rol/${trabajador.id_tipo_usuario}`);
    selectServicio.innerHTML = `<option value="">Selecciona un servicio...</option>`;
    servicios.forEach(s => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.nombre;
      selectServicio.appendChild(option);
    });
  } catch (err) {
    Swal.fire("Error", "No se pudieron cargar los servicios", "error");
  }

  // --- Modalidades ---
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
    Swal.fire("Error", "No se pudieron cargar las modalidades", "error");
  }

  // --- Horarios ---
  const fechaInput = document.querySelector("#fecha");
  const selectHora = document.querySelector("#hora");

  // 🔹 Evitar días pasados
  const hoy = new Date().toISOString().split("T")[0]; 
  fechaInput.setAttribute("min", hoy);

  // 🔹 Función para formatear a 12 horas con AM/PM
  const formatearHora = (hora24) => {
    const [h, m] = hora24.split(":");
    let horas = parseInt(h, 10);
    const minutos = m.padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    horas = horas ? horas : 12; // 0 -> 12
    return `${horas}:${minutos} ${ampm}`;
  };

  fechaInput.addEventListener("change", async () => {
    const fecha = fechaInput.value;
    if (!fecha) return;

    selectHora.innerHTML = `<option value="">Selecciona una hora...</option>`;

    // 🔹 Consultar horas ocupadas del backend
    let horasOcupadas = [];
    try {
      horasOcupadas = await solicitudes.get(`ordenes/ocupadas/${trabajador.id}/${fecha}`);
      horasOcupadas = horasOcupadas.map(h => h.padStart(5, "0"));
    } catch (err) {
      Swal.fire("Error", "No se pudieron obtener las horas ocupadas", "error");
    }

    // 🔹 Generar todas las horas posibles (09:00 a 18:00)
    const horas = [];
    for (let h = 9; h <= 18; h++) {
      horas.push(`${h.toString().padStart(2, "0")}:00`);
    }

    // 🔹 Renderizar horas en el select
    horas.forEach(hora => {
      const option = document.createElement("option");
      option.value = hora;

      if (horasOcupadas.includes(hora)) {
        option.textContent = `${formatearHora(hora)} (Ocupada)`;
        option.disabled = true;
        option.style.color = "gray";
        option.style.fontStyle = "italic";
      } else {
        option.textContent = formatearHora(hora);
      }

      selectHora.appendChild(option);
    });
  });

  // --- Submit ---
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

    const nuevaOrden = {
      id_trabajador: trabajador.id,
      id_usuario: parseInt(idCliente),
      id_servicio: parseInt(servicio),
      id_modalidad: parseInt(modalidad),
      fecha,
      hora, // sigue mandando formato 24h al backend
      productos: null
    };

    try {
      const respuesta = await solicitudes.post("ordenes", nuevaOrden);
      console.log("✅ Orden creada:", respuesta);

      localStorage.setItem("idOrdenActual", respuesta.idOrden);

      Swal.fire("Éxito", "Tu cita fue agendada correctamente", "success").then(() => {
        window.location.hash = "#/agendarProductos";
      });

    } catch (err) {
      Swal.fire("Error", "No se pudo agendar la cita porque ya existe una reserva con la misma hora que acabas de elegir", "error");
    }
  });
};





