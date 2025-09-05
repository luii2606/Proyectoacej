import { ResponseProvider } from "../providers/ResponseProvider.js";
import RolService from "../services/RolService.js";



class RolController {
    static getAllRoles = async (req, res) => {
    try {
      const response = await RolService.getAll();
      // Validamos si hay un error
      if (response.error) {
        // Llamamos el provider para centralizar los mensajes de respuesta
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, response.data, response.message, response.code);

    } catch (error) {
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };
}

export default RolController;