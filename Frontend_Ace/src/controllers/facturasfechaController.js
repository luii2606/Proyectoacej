import * as solicitudes from "../helpers/solicitudes.js";
import { error } from "../helpers/alertas.js";

export const facturasPorDiaController = async () => {
  const btnBuscar = document.getElementById("btn-buscar");
  const inputFecha = document.getElementById("fecha-busqueda");
  const tablaBody = document.getElementById("tabla-facturas-body");

  if (!btnBuscar || !inputFecha || !tablaBody) return;

  if (btnBuscar.dataset.inited === "true") return;
  btnBuscar.dataset.inited = "true";

  btnBuscar.addEventListener("click", async () => {
    const fecha = inputFecha.value;
    tablaBody.innerHTML = "";

    if (!fecha) {
      Swal.fire("Atención", "Selecciona una fecha", "warning");
      return;
    }

    try {
      const facturas = await solicitudes.get(`facturas/fecha/${fecha}`);
      console.log("📥 Facturas recibidas:", facturas);

      if (!facturas || facturas.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="6">No hay facturas en esta fecha</td></tr>`;
        return;
      }

      facturas.forEach((f) => {
        // ✅ Total en pesos colombianos sin decimales
        const totalPesos = f.totalFinal
          ? Number(f.totalFinal).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : "$0";

        // ✅ Convertir hora a formato 12h AM/PM
        let hora12 = "-";
        if (f.horaServicio) {
          const [hora, minutos] = f.horaServicio.split(":");
          let h = parseInt(hora, 10);
          const ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12; // convierte 0 en 12
          hora12 = `${h}:${minutos} ${ampm}`;
        }

        const fila = `
          <tr class="admin__tabla-fila">
            <td>${f.idFactura || "-"}</td>
            <td>${hora12}</td>
            <td>${totalPesos}</td>
            <td>${f.clienteNombre || "-"}</td>
            <td>${f.trabajadorNombre || "-"}</td>
            <td>${f.servicioNombre || "-"}</td>
          </tr>
        `;
        tablaBody.insertAdjacentHTML("beforeend", fila);
      });
    } catch (err) {
      console.error("❌ Error obteniendo facturas:", err);
      error("Error al obtener facturas por fecha");
    }
  });
};



