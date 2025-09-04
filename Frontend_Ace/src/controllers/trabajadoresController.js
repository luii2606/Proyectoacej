import * as validaciones from "../helpers/validaciones.js";
import * as solicitudes from "../helpers/solicitudes.js";
import { success, error, confirm } from "../helpers/alertas.js";

export const trabajadorController = async () => {
  const tablaBody = document.querySelector("#tbody-trabajadores");
  const form = document.getElementById("form");
  const btnGuardar = document.getElementById("btn-guardar");

  // Campo oculto para ID
  const idInput = document.createElement("input");
  idInput.type = "hidden";
  idInput.id = "id-trabajador";
  form.appendChild(idInput);

  // Campos del formulario
  const nombre = document.getElementById("usuario-trabajador");
  const correo = document.getElementById("correo-trabajador");
  const telefono = document.getElementById("telefono-trabajador");
  const contrasena = document.getElementById("contrasena-trabajador");
  const rolSelect = document.getElementById("rol-trabajador");
  const estadoSelect = document.getElementById("estado-trabajador");

  // 🔹 Cargar roles
  const cargarRoles = async () => {
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

  // 🔹 Listener único
  if (form.dataset.inited !== "true") {
    form.dataset.inited = "true";

    if (nombre) nombre.addEventListener("keydown", (e) => validaciones.validarTexto(e));
    if (telefono) telefono.addEventListener("keydown", (e) => validaciones.validarNumero(e));

    // Guardar
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validaciones.validarCampos(e)) return;

      const datos = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        telefono: telefono.value.trim(),
        contrasena: contrasena.value,
        id_tipo_usuario: 3, // fijo: trabajador
        id_roles: rolSelect.value || null,
        id_estado_usuarios: estadoSelect.value || 1
      };

      try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = idInput.value ? "Actualizando..." : "Registrando...";

        if (idInput.value) {
          const resp = await solicitudes.put(datos, `usuarios/${idInput.value}`);
          await success(resp.mensaje || "Trabajador actualizado");
        } else {
          const resp = await solicitudes.post("auth/register", datos);
          await success(resp.mensaje || "Trabajador registrado");
        }

        form.reset();
        idInput.value = "";
        await cargarTrabajadores();
      } catch (err) {
        console.error(err);
        error("Ocurrió un error al guardar el trabajador.");
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Registrar Trabajador";
      }
    });
  }

  // 🔹 Cargar tabla de trabajadores
 const cargarTrabajadores = async () => {
  try {
    const trabajadores = await solicitudes.get("usuarios");
    tablaBody.innerHTML = "";

    trabajadores
      .filter(t => t.id_tipo_usuario === 3) // solo trabajadores
      .forEach(t => {
        const tr = document.createElement("tr");

        // Tomar el nombre desde 'usuario' o 'nombre'
        const nombreUsuario = t.usuario || t.nombre || "";
        // Tomar el rol desde 'rol' o 'nombre_rol'
        const nombreRol = t.rol || t.nombre_rol || "Trabajador";
        // Tomar el estado desde 'estado' o 'nombre_estado'
        const nombreEstado = t.estado || t.nombre_estado || "";

        tr.innerHTML = `
          <td class="admin__tabla-cuerpo">${t.id}</td>
          <td class="admin__tabla-cuerpo">${nombreUsuario}</td>
          <td class="admin__tabla-cuerpo">${t.correo || ""}</td>
          <td class="admin__tabla-cuerpo">${t.telefono || ""}</td>
          <td class="admin__tabla-cuerpo">${nombreRol}</td>
          <td class="admin__tabla-cuerpo">${nombreEstado}</td>
          <td class="admin__tabla-cuerpo">
            <button data-id="${t.id}" class="tabla__boton tabla__boton--editar">Editar</button>
            <button data-id="${t.id}" class="tabla__boton tabla__boton--eliminar">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });

    // Editar (usar las clases correctas)
    tablaBody.querySelectorAll(".tabla__boton--editar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const t = await solicitudes.get(`usuarios/${btn.dataset.id}`);

        // Igual que arriba: tomar los nombres con fallback
        const nombreUsuario = t.usuario || t.nombre || "";

        idInput.value = t.id;
        nombre.value = nombreUsuario;
        correo.value = t.correo || "";
        telefono.value = t.telefono || "";
        contrasena.value = t.contrasena || "";
        // Respetar los nombres exactos del backend
        rolSelect.value = t.id_roles || "";
        estadoSelect.value = t.estado || t.id_Estado_usuarios || t.id_estado_usuarios || "";
      });
    });

    // Eliminar (usar las clases correctas)
    tablaBody.querySelectorAll(".tabla__boton--eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const confirmacion = await confirm("¿Deseas eliminar este trabajador?");
        if (!confirmacion.isConfirmed) return;

        try {
          const resp = await solicitudes.delet(`usuarios/${btn.dataset.id}`);
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

  // 🔹 Inicializar
  await cargarRoles();
  await cargarEstados();
  await cargarTrabajadores();
};

