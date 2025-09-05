import connection from "../utils/db.js";
export class TipoUsuario {
  
  // Obtener todos los tipo de usuario
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM tipo_usuario");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los tipo de usuario");
    }
  }

  // Buscar tipo de usuario por ID
  static async findById(id) {
    const [rows] = await connection.query("SELECT * FROM tipo_usuario WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  // Buscar tipo de usuario por nombre
  static async findByName(nombre) {
    const [rows] = await connection.query("SELECT * FROM tipo_usuario WHERE nombre = ?", [
      nombre,
    ]);
    return rows[0];
  }

  // Crear nuevo  tipo de usuario
  static async create(nombre) {
    const [result] = await connection.query(
      "INSERT INTO tipo_usuario (nombre) VALUES (?)",
      [nombre]
    );
    return result.insertId;
  }

  // Actualizar tipo de usuario
  static async update(id, nombre) {
    const [result] = await connection.query(
      "UPDATE tipo_usuario SET nombre = ? WHERE id = ?",
      [nombre, id]
    );
    return result.affectedRows;
  }

  // Eliminar tipo de usuario
  static async delete(id) {
    const [result] = await connection.query(
      "DELETE FROM tipo_usuario WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}