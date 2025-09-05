import connection from "../utils/db.js";

export class PermisoTipoUsuario {
  
  // Obtener todos los registros de la relación
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM permisos_tipo_usuario");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los permisos_tipo_usuario");
    }
  }

  // Buscar relación por ID
  static async findById(id) {
    const [rows] = await connection.query(
      "SELECT * FROM permisos_tipo_usuario WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Buscar todas las relaciones de un rol
  static async findBytipoUsuario(idtipousuario) {
    const [rows] = await connection.query(
      `SELECT pt.*, p.nombre as permiso, t.nombre as tipo_usuario
       FROM permisos_tipo_usuario pt
       INNER JOIN permisos p ON pt.id = p.id
       INNER JOIN tipo_usuario t ON pt.id_tipo_usuario = t.id
       WHERE pt.id_tipo_usuario = ?`,
      [idtipousuario] 
    );
    return rows;
  }

  // Crear nueva relación (rol ↔ permiso)
  static async create(idtipousuario, idPermiso) {
    const [result] = await connection.query(
      "INSERT INTO permisos_tipo_usuario (id_tipo_usuario, id_permiso) VALUES (?, ?)",
      [idtipousuario, idPermiso]
    ); 
    return result.insertId;
  }

  // Actualizar relación
  static async update(id, idtipousuario, idPermiso) {
    const [result] = await connection.query(
      "UPDATE permisos_tipo_usuario SET id_tipo_usuario = ?, id_permiso = ? WHERE id = ?",
      [idtipousuario, idPermiso, id]
    );
    return result.affectedRows;
  }

  // Eliminar relación
  static async delete(id) {
    const [result] = await connection.query(
      "DELETE FROM permisos_tipo_usuario WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}