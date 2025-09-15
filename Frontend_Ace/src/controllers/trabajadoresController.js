import * as validaciones from "../helpers/validaciones.js";
import * as solicitudes from "../helpers/solicitudes.js";
import { success, error, confirm } from "../helpers/alertas.js";

export const trabajadorController = async () => {
  const tablaBody = document.querySelector("#tbody-trabajadores");
  const form = document.getElementById("form");
  const btnGuardar = document.getElementById("btn-guardar");

  // Campo oculto para ID (solo si existe form)
  let idInput = null;
  if (form) {
    idInput = document.createElement("input");
    idInput.type = "hidden";
    idInput.id = "id-trabajador";
    form.appendChild(idInput);
  }

  // Campos del formulario
  const nombre = document.getElementById("usuario-trabajador");
  const correo = document.getElementById("correo-trabajador");
  const telefono = document.getElementById("telefono-trabajador");
  const contrasena = document.getElementById("contrasena-trabajador");
  const rolSelect = document.getElementById("rol-trabajador");
  const estadoSelect = document.getElementById("estado-trabajador");

  // 🔹 Cargar roles
  const cargarRoles = async () => {
    if (!rolSelect) return; // no hay select en la vista de tabla
    rolSelect.innerHTML = `<option value="">Seleccione un rol</option>`;
    try {
      const roles = await solicitudes.get("roles");
      roles.forEach((rol) => {
        const option = document.createElement("option");
        option.value = rol.id;
        option.textContent = rol.nombre;
        rolSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

  // 🔹 Cargar estados
  const cargarEstados = async () => {
    if (!estadoSelect) return;
    estadoSelect.innerHTML = `<option value="">Seleccione un estado</option>`;
    try {
      const estados = await solicitudes.get("estado_usuarios");
      estados.forEach((estado) => {
        const option = document.createElement("option");
        option.value = estado.id;
        option.textContent = estado.nombre;
        estadoSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando estados:", err);
    }
  };

  // 🔹 Cargar tabla de trabajadores
  const cargarTrabajadores = async () => {
    if (!tablaBody) return;
    try {
      const trabajadores = await solicitudes.get("usuarios");
      //console.log(trabajadores);
      tablaBody.innerHTML = "";

      trabajadores
        .filter((t) => t.id_roles === 3) // solo trabajadores
        .forEach((t) => {
          const tr = document.createElement("tr");

        const nombreUsuario = t.usuario || t.nombre || "";

          const nombreEstado = t.estado || t.nombreEstado || "";
          tr.innerHTML = `
            <td class="admin__tabla-cuerpo">${t.id}</td>
            <td class="admin__tabla-cuerpo">${nombreUsuario}</td>
            <td class="admin__tabla-cuerpo">${t.correo || ""}</td>
            <td class="admin__tabla-cuerpo">${t.telefono || ""}</td>
            <td class="admin__tabla-cuerpo">${t.nombre_tipo_usuario}</td>
            <td class="admin__tabla-cuerpo">${nombreEstado}</td>
            <td class="admin__tabla-cuerpo">
              <button data-id="${t.id}" class="tabla__boton tabla__boton--eliminar">Eliminar</button>
            </td>
          `;
          tablaBody.appendChild(tr);
        });

      // Eliminar
      tablaBody.querySelectorAll(".tabla__boton--eliminar").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const confirmacion = await confirm("¿Deseas eliminar este trabajador?");
          if (!confirmacion.isConfirmed) return;

          try {
            const resp = await solicitudes.delet(`usuarios/${btn.dataset.id}`);
            console.log("Eliminar id:", btn.dataset.id);
            await success(resp.mensaje || "Trabajador eliminado");
            await cargarTrabajadores();
          } catch (err) {
            console.error(err);
            error("No se pudo eliminar el trabajador.");
          }
        });
      });
    } catch (err) {
      console.error(err);
      error("No se pudieron cargar los trabajadores.");
    }
  };

  // 🔹 Listeners solo si existe formulario
  if (form && form.dataset.inited !== "true") {
    form.dataset.inited = "true";

    if (nombre) nombre.addEventListener("keydown", (e) => validaciones.validarTexto(e));
    if (telefono) telefono.addEventListener("keydown", (e) => validaciones.validarNumero(e));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
       // Validación manual de campos vacíos
      if (
        !nombre.value.trim() ||
        !correo.value.trim() ||
        !telefono.value.trim() ||
        !contrasena.value.trim() ||
        !rolSelect.value ||
        !estadoSelect.value
      ) {
        error("Por favor complete todos los campos antes de registrar el trabajador.");
        return;
          }
            // Nombre mínimo 5 caracteres
      if (nombre.value.trim().length < 5) {
        error("El nombre debe tener al menos 5 caracteres.");
        return;
      }

      // Correo válido con @gmail.com
      const regexCorreo = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!regexCorreo.test(correo.value.trim())) {
        error("El correo debe ser válido ");
        return;
      }

      // Teléfono con 9 dígitos
      const regexTelefono = /^[0-9]{9}$/;
      if (!regexTelefono.test(telefono.value.trim())) {
        error("El teléfono debe tener exactamente 9 números.");
        return;
      }

      // Contraseña fuerte: minúscula, mayúscula, número, carácter especial, mínimo 8
      const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!regexContrasena.test(contrasena.value)) {
        error("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.");
        return;
      }
    const datos = {
    nombre: nombre.value.trim(),
    correo: correo.value.trim(),
    telefono: telefono.value.trim(),
    contrasena: contrasena.value,
    id_roles: 3, // trabajador fijo
    id_tipo_usuario: rolSelect?.value || null,
    id_estado_usuarios: estadoSelect && estadoSelect.value !== "" ? parseInt(estadoSelect.value) : null
  };

      try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = idInput.value ? "Actualizando..." : "Registrando...";

        if (idInput.value) {
          const resp = await solicitudes.put(datos, `usuarios/${idInput.value}`);
          await success(resp.mensaje || "Trabajador actualizado");
        } else {
          const resp = await solicitudes.post("auth/register-trabajador", datos);
           window.location.hash = "#/tablaTrabajadores";
          await success(resp.mensaje || "Trabajador registrado");
        }

        form.reset();
        idInput.value = "";
        await cargarTrabajadores();
      } catch (err) {
        console.error(err);
        error("Ocurrió un error asegurate de diligenciar los campos.");
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Registrar Trabajador";
      }
    });
  }

  // 🔹 Inicializar según la vista
  await cargarRoles();
  await cargarEstados();
  await cargarTrabajadores();
};
