import { ResponseProvider } from "../providers/ResponseProvider.js";
import UsuarioService from "../services/UsuarioService.js";

class UsuarioController {

  // Obtener todos los Usuarios
  static getAllUsuarios = async (req, res) => {
    try {
      // Llamamos al servicio para obtener los usuarios
      const response = await UsuarioService.getusuario();
      // Validamos si no hay usuarios
      if (response.error) {
        // Llamamos el provider para centralizar los mensajes de respuesta
        return ResponseProvider.error(
          res,
          response.message,
          response.code
        );
      } else {
        // Llamamos el provider para centralizar los mensajes de respuesta        
        return ResponseProvider.success(
          res,
          response.data,
          response.message,
          response.code
        );
      }
    } catch (error) {
      console.log(error);
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.error(res, "Error al interno en el servidor", 500);
    }
  }
}
export default UsuarioController;
