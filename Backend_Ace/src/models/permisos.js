import connection from "../utils/db.js";

export class Permiso {
  
  // Obtener todos los permisos
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM permisos");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los permisos");
    }
  }

  // Buscar permiso por ID
  static async findById(id) {
    const [rows] = await connection.query("SELECT * FROM permisos WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  // Buscar permiso por nombre
  static async findByName(nombre) {
    const [rows] = await connection.query("SELECT * FROM permisos WHERE nombre = ?", [
      nombre,
    ]);
    return rows[0];
  }

  // Crear nuevo permiso
  static async create(nombre, descripcion) {
    const [result] = await connection.query(
      "INSERT INTO permisos (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    return result.insertId;
  }

  // Actualizar permiso
  static async update( nombre, descripcion) {
    const [result] = await connection.query(
      "UPDATE permisos SET nombre = ?, descripcion = ? WHERE id = ?",
      [nombre, descripcion]
    );
    return result.affectedRows;
  }

  // Eliminar permiso
  static async delete(id) {
    const [result] = await connection.query(
      "DELETE FROM permisos WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}