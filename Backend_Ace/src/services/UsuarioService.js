import Usuario from "../models/Usuario.js";

class UsuarioService {

  static async getusuario() {
    try {
      const usuarioInstance = new Usuario();
      const usuarios = await usuarioInstance.getAll();
      // Validamos si no hay usuarios      
      if (usuarios.length === 0) {
        return {
          error: true,
          code: 404,
          message: "No hay usuarios registrados",
        };
      }
      // Retornamos las usuarios obtenidas
      return {
        error: false,
        code: 200,
        message: "usuarios obtenidos correctamente",
        data: usuarios,
      };
    } catch (error) {
      
      return {
        error: true,
        code: 500,
        message: "Error al obtener los usuarios",
      };
    }
  }
}

export default UsuarioService;