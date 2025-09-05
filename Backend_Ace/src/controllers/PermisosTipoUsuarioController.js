import {ResponseProvider} from "../providers/ResponseProvider.js";
import PermisoTipoUsuarioService from "../services/permisosTipoUsuarioService.js";

class PermisoTipoUsuarioController {

  // Obtener todos las relaciones permiso-tipo-usuario
  static getAllPermisosTipoUsuario = async (req, res) => {
    try {
      const response = await PermisoTipoUsuarioService.getAll();
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

  // Obtener una relación permiso-tipo-usuario por su ID
  static getPermisoTipoUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para obtener la relación permiso-tipo-usuario por su ID
      const response = await PermisoTipoUsuarioService.getById(id);
      // Validamos si no hay una relación permiso-tipo-usuario
      if (response.error) {
        // Llamamos el provider para centralizar los mensajes de respuesta
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, response.data, response.message, response.code);
    } catch (error) {
      // Llamamos el provider para centralizar los mensajes de respuesta
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  // Crear una nueva relación permiso-tipo-usuario
  static createPermisoTipoUsuario = async (req, res) => {
    const permisoRol = req.body;
    try {
      // Llamamos el método crear del modelo
      const response = await PermisoTipoUsuarioService.create(permisoRol);
      // Validamos que la respuesta no tenga error
      if (response.error) {
        // Llamamos el provider para centralizar los mensajes de respuesta
        return ResponseProvider.error(res, response.message, response.code);
      }
      // Retornamos la relación permiso-tipo-usuario creada
      return ResponseProvider.success(res, response.data, response.message, 201);
    } catch (error) {
      // Llamamos el provider para centralizar los mensajes de respuesta
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  // Actualizar una relacion permiso-tipo-usuario
  static updatePermisoTipoUsuario = async (req, res) => {
    const { id } = req.params;
    const permisoRol = req.body;
    try {
      // Llamamos al método actualizar del modelo
      const response = await PermisoTipoUsuarioService.update(id, permisoRol);
      // Validamos que la respuesta no tenga error
      if (response.error) {
        // Llamamos el provider para centralizar los mensajes de respuesta
        return ResponseProvider.error(res, response.message, response.code);
      }      

      // Retornamos la relación permiso-tipo-usuario actualizada
      return ResponseProvider.success(res, response.data, response.message, 200);
    } catch (error) {
      // Llamamos el provider para centralizar los mensajes de respuesta
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  // Eliminar una relación permiso-tipo-usuario
  static deletePermisoTipoUsuario = async (req, res) => {
    const { id } = req.params;
    try {
      // Llamamos al servicio para eliminar la relación ppermiso-tipo-usuario por su ID
      const response = await PermisoTipoUsuarioService.delete(id);
      // Validamos si no se pudo eliminar la relación permiso-tipo-usuario
      if (response.error) {
        // Llamamos el provider para centralizar los mensajes de respuesta
        return ResponseProvider.error(res, response.message, response.code);
      }      
      return ResponseProvider.success(res, response.data, response.message ,response.code);
    } catch (error) {
      // Llamamos el provider para centralizar los mensajes de respuesta
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  }
}

export default PermisoTipoUsuarioController;