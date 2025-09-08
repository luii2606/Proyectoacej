import * as validaciones from "../helpers/validaciones.js";
import * as solicitudes from "../helpers/solicitudes.js";
import { success, error, confirm } from "../helpers/alertas.js";

export const productosController = async () => {
  const tablaBody = document.querySelector("#tbody-productos");

  // Cache para estados (evita múltiples llamadas)
  let estadosCache = null;

  // Carga y/o aplica estados a un <select> dado.

  // Asegura que exista el input hidden para el id (editar)
  const ensureIdInput = (form) => {
    let idInput = form.querySelector("#id-producto");
    if (!idInput) {
      idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.id = "id-producto";
      form.appendChild(idInput);
    }
    return idInput;
  };

  // Inicializa los comportamientos del formulario (validaciones, submit).
  const initFormBehavior = async (form) => {
    if (!form) return;
    if (form.dataset.inited === "true") return;
    form.dataset.inited = "true";

    const nombre = form.querySelector("#nombre-producto");
    const descripcion = form.querySelector("#descripcion");
    const precio = form.querySelector("#precio-producto");
    const cantidad = form.querySelector("#cantidad-producto");
    const btnGuardar = form.querySelector("#btn-guardar");

    ensureIdInput(form);

    if (nombre) nombre.addEventListener("keydown", (e) => validaciones.validarTexto(e));
    if (precio) precio.addEventListener("keydown", (e) => validaciones.validarNumero(e));
    if (cantidad) cantidad.addEventListener("keydown", (e) => validaciones.validarNumero(e));

    // Poblar el select (usa cache si ya se cargó)

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validaciones.validarCampos(e)) return;

      const idInput = form.querySelector("#id-producto");

      const datos = {
        nombreProducto: (nombre?.value || "").trim(),
        descripcion: (descripcion?.value || "").trim(),
        precio: parseFloat((precio?.value || "").trim()) || 0,
        cantidad: parseInt((cantidad?.value || "").trim()) || 0,
        idEstadoProducto: 1,
      };
      
      

      try {
        if (btnGuardar) {
          btnGuardar.disabled = true;
          btnGuardar.textContent = idInput?.value ? "Actualizando..." : "Registrando...";
        }

        if (idInput?.value) {
          const resp = await solicitudes.put(`productos/${idInput.value}`, datos);
          await success(resp.mensaje || "Producto actualizado");
        } else {
          const resp = await solicitudes.post("productos", datos);
          await success(resp.mensaje || "Producto registrado");
        }

        form.reset();
        if (idInput) idInput.value = "";
        if (btnGuardar) btnGuardar.textContent = "Registrar Producto";

        // Volver a la lista y recargar
        window.location.hash = "#/tablaProductos";
        await cargarProductos();
      } catch (err) {
        console.error(err);
        error("Ocurrió un error al guardar el producto.");
      } finally {
        if (btnGuardar) btnGuardar.disabled = false;
      }
    });
  };

  // Rellena el formulario con los datos de un producto (asegura select poblado)
  const fillFormWithProduct = async (producto) => {
    const form = document.getElementById("form");
    if (!form) return;

    const idInput = ensureIdInput(form);
    const nombre = form.querySelector("#nombre-producto");
    const descripcion = form.querySelector("#descripcion");
    const precio = form.querySelector("#precio-producto");
    const cantidad = form.querySelector("#cantidad-producto");
    
    const btnGuardar = form.querySelector("#btn-guardar");

    // Asegurar que el select tenga opciones
    

    idInput.value = producto.id ?? "";
    if (nombre) nombre.value = producto.nombreProducto ?? "";
    if (descripcion) descripcion.value = producto.descripcion ?? "";
    if (precio) precio.value = producto.precio ?? "";
    if (cantidad) cantidad.value = producto.cantidad ?? "";

    if (btnGuardar) btnGuardar.textContent = "Actualizar Producto";

    // foco para UX
    setTimeout(() => { nombre?.focus(); }, 50);
  };

  // Si el form no existe aún en la carga, lo inicializamos cuando aparezca
  const waitAndInitFormIfNeeded = () => {
    const form = document.getElementById("form");
    if (form) {
      initFormBehavior(form);
      return;
    }

    const observer = new MutationObserver(async (muts, obs) => {
      const f = document.getElementById("form");
      if (f) {
        await initFormBehavior(f);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Cargar tabla de productos y adjuntar handlers (editar/eliminar)
  const cargarProductos = async () => {
    if (!tablaBody) return;
    try {
      const productos = await solicitudes.get("productos");
      tablaBody.innerHTML = "";

      productos.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="admin__tabla-cuerpo">${p.nombreProducto}</td>
          <td class="admin__tabla-cuerpo">${p.descripcion || ""}</td>
          <td class="admin__tabla-cuerpo">$${p.precio}</td>
          <td class="admin__tabla-cuerpo">${p.cantidad}</td>
          <td class="admin__tabla-cuerpo">${p.nombreEstado || "Sin estado"}</td>
          <td class="admin__tabla-cuerpo">
            <button data-id="${p.id}" class="tabla__boton tabla__boton--editar">Editar</button>
            <button data-id="${p.id}" class="tabla__boton tabla__boton--eliminar">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });

      // EDITAR: handler
      tablaBody.querySelectorAll(".tabla__boton--editar").forEach((btn) => {
        btn.addEventListener("click", async () => {
          try {
            const producto = await solicitudes.get(`productos/${btn.dataset.id}`);

            // Navegar a la ruta del formulario (hash routing)
            window.location.hash = "#/adminTrabajadores";

            // Si el formulario ya está en el DOM, inícialo y rellénalo
            const formNow = document.getElementById("form");
            if (formNow) {
              await initFormBehavior(formNow);
              await fillFormWithProduct(producto);
              return;
            }

            // Si no está, esperar a que aparezca y luego inicializar + rellenar
            const obs = new MutationObserver(async (muts, observer) => {
              const f = document.getElementById("form");
              if (f) {
                await initFormBehavior(f);
                await fillFormWithProduct(producto);
                observer.disconnect();
              }
            });

            obs.observe(document.body, { childList: true, subtree: true });

            // Fallback: desconectar después de X ms para evitar observadores eternos
            setTimeout(() => obs.disconnect(), 8000);
          } catch (err) {
            console.error(err);
            error("No se pudo cargar el producto para editar.");
          }
        });
      });

      // ELIMINAR: handler
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

  // Cuando cambie el hash, nos aseguramos de inicializar el formulario si corresponde.
  window.addEventListener("hashchange", async () => {
    const h = window.location.hash || "";
    if (h.includes("adminTrabajadores")) {
      const f = document.getElementById("form");
      if (f) {
        await initFormBehavior(f);
        // Si está en modo nuevo (no editar) aseguramos estado limpio
        const idInput = f.querySelector("#id-producto");
        if (idInput && !idInput.value) {
          f.reset();
          const btn = f.querySelector("#btn-guardar");
          if (btn) btn.textContent = "Registrar Producto";
        }
      } else {
        // si no está, dejamos que el observador lo inicialice cuando aparezca
        waitAndInitFormIfNeeded();
      }
    }
    if (h.includes("tablaProductos")) {
      await cargarProductos();
    }
  });

  // Inicializar: si el form ya está en el DOM lo inicializamos, si no observamos
  waitAndInitFormIfNeeded();

  // Cargar lista inicial
  await cargarProductos();
};
