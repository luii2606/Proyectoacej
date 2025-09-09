import { get } from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

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
    let seleccionados = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

    const estaSeleccionado = (id) => seleccionados.some((p) => p.id === id);

    // Traer productos del backend
    const lista = await get("productos");
    console.log("Productos recibidos:", lista); // 👈 debug

    contenedor.innerHTML = "";

    lista.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("producto-item");
      div.innerHTML = `
        <h3>${p.nombreProducto}</h3>
        <p>${p.descripcion || ""}</p>
        <p>Precio: $${p.precio}</p>
        <button class="producto-btn">
          ${estaSeleccionado(p.id) ? "Deseleccionar" : "Seleccionar"}
        </button>
      `;
      contenedor.appendChild(div);

      // Manejo de selección/deselección
      const btn = div.querySelector(".producto-btn");
      btn.addEventListener("click", () => {
        if (estaSeleccionado(p.id)) {
          seleccionados = seleccionados.filter((item) => item.id !== p.id);
          btn.textContent = "Seleccionar";
        } else {
          seleccionados.push(p);
          btn.textContent = "Deseleccionar";
        }
        localStorage.setItem("productosSeleccionados", JSON.stringify(seleccionados));
      });
    });

    // ✅ Botón: agregar productos seleccionados
    btnGuardar.addEventListener("click", () => {
      localStorage.setItem("productosSeleccionados", JSON.stringify(seleccionados));
      window.location.hash = "#/orden-completada"; // Redirigir
    });

    // ❌ Botón: no gracias
    btnNo.addEventListener("click", () => {
      localStorage.removeItem("productosSeleccionados");
      window.location.hash = "#/orden-completada"; // Redirigir
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
    error("No se pudieron cargar los productos");
  }
};








