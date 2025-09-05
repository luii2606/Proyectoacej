import connection from "../utils/db.js";
export class Rol {
  
  // Obtener todos los roles
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM roles");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los roles");
    }
  }

  // Buscar rol por ID
  static async findById(id) {
    const [rows] = await connection.query("SELECT * FROM roles WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  // Buscar rol por nombre
  static async findByName(nombre) {
    const [rows] = await connection.query("SELECT * FROM roles WHERE nombre = ?", [
      nombre,
    ]);
    return rows[0];
  }

  // Crear nuevo rol
  static async create(nombre) {
    const [result] = await connection.query(
      "INSERT INTO roles (nombre) VALUES (?)",
      [nombre]
    );
    return result.insertId;
  }

  // Actualizar rol
  static async update(id, nombre) {
    const [result] = await connection.query(
      "UPDATE roles SET nombre = ? WHERE id = ?",
      [nombre, id]
    );
    return result.affectedRows;
  }

  // Eliminar rol
  static async delete(id) {
    const [result] = await connection.query(
      "DELETE FROM roles WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}