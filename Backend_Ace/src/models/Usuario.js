// models/Usuario.js
import  connection from "../utils/db.js";

class Usuario {

  // Método para obtener todas las categorías
  async getAll() {
    try {
      const [rows] = await connection.query("SELECT * FROM usuarios");
      return rows; // Retorna los uau obtenidas
    } catch (error) {
      throw new Error("Error al obtener los usuarios");
    }
  }
  
}
export default Usuario;