// models/Usuario.js
import  connection from "../utils/db.js";

export class Usuario {

  // Método para obtener todas las categorías
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM usuarios");
      return rows; // Retorna los uau obtenidas
    } catch (error) {
      throw new Error("Error al obtener los usuarios");
    }
  }
  
    static async findByEmail(correo) {
    const [rows] = await connection.query("SELECT * FROM usuarios WHERE correo = ?", [
      correo,
    ]);
    return rows[0];
  }

       static async getById(id) {
    const [rows] = await connection.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }


    // Método para crear un nuevo usuario
   static async create(nombre, correo, telefono, hashedPassword) {
    console.log(nombre, correo, telefono, hashedPassword);
    const [result] = await connection.query(
      "INSERT INTO usuarios (nombre, correo, telefono, contrasena, id_tipo_usuario) VALUES (?, ?, ?, ?, 2)",
      [nombre, correo, telefono, hashedPassword]
    );
    return result.insertId;
  }

  
}