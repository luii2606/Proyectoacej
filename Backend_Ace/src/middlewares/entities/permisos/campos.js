// Definición de los campos de la entidad Permiso
export const campos = [
  { name: "nombre", required: true, minLength: 3, maxLength: 30, type: "string" },
  { name: "descripcion", required: true, minLength: 1, maxLength: 100, type: "string" },  
];