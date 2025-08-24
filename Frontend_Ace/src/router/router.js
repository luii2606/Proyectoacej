import { routers } from "./routes.js"

import { routers } from "./routes.js";

export const router = async (app) => {
  const hash = location.hash.slice(1); // Elimina el "#"
  let arregloHash = hash.split("/");

  const [ruta, parametros] = recorrerRutas(routers, arregloHash);

  if (!ruta) {
    app.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  // Cargar la vista HTML en el contenedor
  await cargarVista(ruta.path, app);

  // Ejecutar el controller asociado a la ruta
  if (typeof ruta.controller === "function") {
    ruta.controller(parametros);
  }
};

// Función para recorrer las rutas y obtener la coincidencia
const recorrerRutas = (routes, arregloHash) => {
  let parametros = {};

  for (const key in routes) {
    if (arregloHash.length === 1 && arregloHash[0] === "") {
      return [routes[key], parametros];
    }

    if (key === arregloHash[0]) {
      return [routes[key], parametros];
    }
  }
  return [null, parametros];
};

// Función para cargar la vista HTML
const cargarVista = async (path, elemento) => {
  try {
    const respuesta = await fetch(`./src/views/${path}`);
    if (!respuesta.ok) throw new Error("No pudimos leer el archivo");
    const html = await respuesta.text();
    elemento.innerHTML = html;
  } catch (error) {
    console.error("Error cargando la vista:", error);
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
  }
};
