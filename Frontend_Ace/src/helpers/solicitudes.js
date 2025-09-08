// src/helpers/solicitudes.js

const url = "http://localhost:8080/pruebaApi/api";

/**
 * Helper para añadir el token en headers si existe
 */
function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Realiza una petición GET al backend
 * @param {string} endpoint - Ruta del endpoint (ejemplo: "auth/refresh")
 */
export const get = async (endpoint) => {
  const res = await fetch(`${url}/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error(`Error GET ${endpoint}: ${res.status}`);
  return await res.json();
};


/**
 * Realiza una petición POST al backend (JSON)
 * @param {string} endpoint - Ruta del endpoint (ejemplo: "auth/login")
 * @param {object} datos - Datos a enviar en el body
 */
export const post = async (endpoint, datos = {}) => {
  const res = await fetch(`${url}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw new Error(`Error POST ${endpoint}: ${res.status}`);
  return await res.json();
};

/**
 * Realiza una petición PUT al backend (JSON)
 * @param {string} endpoint - Ruta del endpoint (ejemplo: "usuarios/1")
 * @param {object} datos - Datos a enviar en el body
 */
export const put = async (endpoint, datos = {}) => {
  const res = await fetch(`${url}/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw new Error(`Error PUT ${endpoint}: ${res.status}`);
  return await res.json();
};

/**
 * Realiza una petición DELETE al backend
 * @param {string} endpoint - Ruta del endpoint (ejemplo: "usuarios/1")
 */
export const delet = async (endpoint) => {
  const res = await fetch(`${url}/${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error(`Error DELETE ${endpoint}: ${res.status}`);
  return await res.json();
};

