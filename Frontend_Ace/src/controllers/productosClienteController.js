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
      const div = document.createElement("div");
      div.classList.add("producto-item");
      div.innerHTML = `
        <h3>${p.nombreProducto}</h3>
        <p>${p.descripcion || ""}</p>
        <p>Precio: $${p.precio}</p>
        <div class="producto-controles">
          <label>
            Cantidad:
            <input type="number" min="1" value="${obtenerCantidad(p.id)}" class="producto-cantidad" />
          </label>
          <button class="producto-btn">
            ${estaSeleccionado(p.id) ? "Deseleccionar" : "Seleccionar"}
          </button>
        </div>
      `;
      contenedor.appendChild(div);

      const inputCantidad = div.querySelector(".producto-cantidad");
      const btn = div.querySelector(".producto-btn");

      // Manejo de cantidad
      inputCantidad.addEventListener("input", () => {
        const cant = parseInt(inputCantidad.value, 10) || 1;
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

      // Manejo de selección/deselección
      btn.addEventListener("click", () => {
        if (estaSeleccionado(p.id)) {
          seleccionados = seleccionados.filter((item) => item.id !== p.id);
          btn.textContent = "Seleccionar";
        } else {
          seleccionados.push({ ...p, cantidad: parseInt(inputCantidad.value, 10) || 1 });
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

        // ⚡ Aquí deberías tener el id de la orden (ejemplo, desde localStorage)
        const idOrden = localStorage.getItem("idOrdenActual");
        if (!idOrden) {
          error("No hay orden activa para guardar productos");
          return;
        }

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










