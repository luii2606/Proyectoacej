import * as validaciones from "../helpers/validaciones.js";
import * as solicitudes from "../helpers/solicitudes.js";
import { success, error, confirm } from "../helpers/alertas.js";

export const productosController = async () => {
  const tablaBody = document.querySelector("#tbody-productos"); // asegúrate que tu <tbody> tenga este id
  const form = document.getElementById("form");
  const btnGuardar = document.getElementById("btn-guardar");

  // Campo oculto para ID (editar producto)
  let idInput = null;
  if (form) {
    idInput = document.createElement("input");
    idInput.type = "hidden";
    idInput.id = "id-producto";
    form.appendChild(idInput);
  }

  // Campos del formulario
  const nombre = document.getElementById("nombre-producto");
  const descripcion = document.getElementById("descripcion");
  const precio = document.getElementById("precio-producto");

  // 🔹 Cargar tabla de productos
  const cargarProductos = async () => {
    if (!tablaBody) return;
    try {
      const productos = await solicitudes.get("productos");
      tablaBody.innerHTML = "";

      productos.forEach((p) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td class="admin__tabla-cuerpo">${p.id}</td>
          <td class="admin__tabla-cuerpo">${p.nombreProducto}</td>
          <td class="admin__tabla-cuerpo">${p.descripcion || ""}</td>
          <td class="admin__tabla-cuerpo">$${p.precio}</td>
          <td class="admin__tabla-cuerpo">
            <button data-id="${p.id}" class="tabla__boton tabla__boton--eliminar">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });

      // Eliminar
      tablaBody.querySelectorAll(".tabla__boton--eliminar").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const confirmacion = await confirm("¿Deseas eliminar este producto?");
          if (!confirmacion.isConfirmed) return;

          try {
            const resp = await solicitudes.delet(`productos/${btn.dataset.id}`);
            await success(resp.mensaje || "Producto eliminado");
            await cargarProductos();
          } catch (err) {
            console.error(err);
            error("No se pudo eliminar el producto.");
          }
        });
      });
    } catch (err) {
      console.error(err);
      error("No se pudieron cargar los productos.");
    }
  };

  // 🔹 Listener del formulario
  if (form && form.dataset.inited !== "true") {
    form.dataset.inited = "true";

    if (nombre) nombre.addEventListener("keydown", (e) => validaciones.validarTexto(e));
    if (precio) precio.addEventListener("keydown", (e) => validaciones.validarNumero(e));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validaciones.validarCampos(e)) return;

      const datos = {
    nombreProducto: nombre.value.trim(),
    descripcion: descripcion.value.trim(),
    precio: parseFloat(precio.value.trim()) || 0,
    idEstadoProducto: 1 // o el valor que corresponda desde tu formulario
  };

      try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = idInput.value ? "Actualizando..." : "Registrando...";

        if (idInput.value) {
          const resp = await solicitudes.put(datos, `productos/${idInput.value}`);
          await success(resp.mensaje || "Producto actualizado");
        } else {
          const resp = await solicitudes.post("productos", datos);
          await success(resp.mensaje || "Producto registrado");
        }

        form.reset();
        idInput.value = "";
        await cargarProductos();
      } catch (err) {
        console.error(err);
        error("Ocurrió un error al guardar el producto.");
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Registrar Producto";
      }
    });
  }

  // 🔹 Inicializar
  await cargarProductos();
};
