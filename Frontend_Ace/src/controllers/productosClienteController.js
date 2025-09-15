import { get, post } from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

// Espera a que un elemento exista en el DOM
const waitForElement = (selector) =>
  new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const elNow = document.querySelector(selector);
      if (elNow) {
        resolve(elNow);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });

export const productosClienteController = async () => {
  try {
    // Esperar a que los elementos estén en el DOM
    const contenedor = await waitForElement("#productos-list");
    const btnGuardar = await waitForElement("#productos-guardar");
    const btnNo = await waitForElement("#productos-no");

    // Recuperar productos previamente seleccionados (siempre array)
    let seleccionados =
      JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

    const estaSeleccionado = (id) =>
      seleccionados.some((p) => p.id === id);

    const obtenerCantidad = (id) => {
      const prod = seleccionados.find((p) => p.id === id);
      return prod ? prod.cantidad || 1 : 1;
    };

    // Traer productos del backend
    const lista = await get("productos");
    console.log("Productos recibidos:", lista);

    contenedor.innerHTML = "";

    lista.forEach((p) => {
      // ❌ Ocultar productos sin stock o cantidad = 0
      if (!p.cantidad || p.cantidad <= 0) {
        return; // No renderizar esta card
      }

      const div = document.createElement("div");
      div.classList.add("producto-item");
      div.innerHTML = `
        <h3>${p.nombreProducto}</h3>
        <p>${p.descripcion || ""}</p>
        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.cantidad}</p>
        <div class="producto-controles">
          <label>
            Cantidad:
            <input 
              type="number" 
              min="1" 
              max="${p.cantidad}" 
              value="${Math.min(obtenerCantidad(p.id), p.cantidad)}" 
              class="producto-cantidad" 
            />
          </label>
          <button class="producto-btn">
            ${estaSeleccionado(p.id) ? "Deseleccionar" : "Seleccionar"}
          </button>
        </div>
      `;
      contenedor.appendChild(div);

      const inputCantidad = div.querySelector(".producto-cantidad");
      const btn = div.querySelector(".producto-btn");

      // ✅ Validación en input cantidad
      inputCantidad.addEventListener("input", () => {
        let cant = parseInt(inputCantidad.value, 10) || 1;

        if (cant < 1) {
          cant = 1;
        } else if (cant > p.cantidad) {
          cant = p.cantidad;
        }
        inputCantidad.value = cant;

        if (estaSeleccionado(p.id)) {
          seleccionados = seleccionados.map((item) =>
            item.id === p.id ? { ...item, cantidad: cant } : item
          );
          localStorage.setItem(
            "productosSeleccionados",
            JSON.stringify(seleccionados)
          );
        }
      });

      // ✅ Manejo de selección/deselección
      btn.addEventListener("click", () => {
        const cant = parseInt(inputCantidad.value, 10);

        if (cant <= 0 || isNaN(cant)) {
          error("Debes seleccionar una cantidad mayor a 0");
          return;
        }

        if (cant > p.cantidad) {
          error(`No puedes seleccionar más de ${p.cantidad} unidades`);
          return;
        }

        if (estaSeleccionado(p.id)) {
          seleccionados = seleccionados.filter((item) => item.id !== p.id);
          btn.textContent = "Seleccionar";
        } else {
          seleccionados.push({ ...p, cantidad: cant });
          btn.textContent = "Deseleccionar";
        }
        localStorage.setItem(
          "productosSeleccionados",
          JSON.stringify(seleccionados)
        );
      });
    });

// ✅ Botón: agregar productos seleccionados en detalle_orden_producto
btnGuardar.addEventListener("click", async () => {
  try {
    if (seleccionados.length === 0) {
      error("No has seleccionado productos");
      return;
    }

    const idOrden = localStorage.getItem("idOrdenActual");
    if (!idOrden) {
      error("No hay orden activa para guardar productos");
      return;
    }

    // 🔎 Primero validar todos los productos
    const errores = [];
    for (const prod of seleccionados) {
      const cantidad = prod.cantidad || 1;
      if (cantidad <= 0 || cantidad > prod.cantidad) {
        errores.push(`Cantidad inválida para el producto ${prod.nombreProducto}`);
      }
    }

    if (errores.length > 0) {
      error(errores.join("\n"));
      return;
    }

    // 🚀 Si no hay errores, enviamos todos los productos
    for (const prod of seleccionados) {
      const cantidad = prod.cantidad || 1;
      const detalle = {
        id_orden: parseInt(idOrden, 10),
        id_producto: prod.id,
        cantidad,
        subtotal: prod.precio * cantidad,
      };

      console.log("Enviando detalle:", detalle);
      await post("detalleOrdenProducto", detalle);
    }

    success("Productos añadidos a la orden con éxito");
    localStorage.setItem(
      "productosSeleccionados",
      JSON.stringify(seleccionados)
    );
    window.location.hash = "#/verCitas";
  } catch (err) {
    console.error("Error guardando detalle:", err);
    error("No se pudieron guardar los productos en la orden");
  }
});


    // ❌ Botón: no gracias
    btnNo.addEventListener("click", () => {
      localStorage.removeItem("productosSeleccionados");
      window.location.hash = "#/verCitas";
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
    error("No se pudieron cargar los productos");
  }
};



