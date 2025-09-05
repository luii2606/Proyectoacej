import {ResponseProvider} from "../providers/ResponseProvider.js";
import PermisoService from "../services/PermisosService.js";

class PermisoController {
  static getAll = async (req, res) => {
    try {
      const response = await PermisoService.getAll();
      if (response.error) {
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, response.data, response.message, response.code);
    } catch (error) {
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const response = await PermisoService.getById(id);
      if (response.error) {
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, response.data, response.message, response.code);
    } catch (error) {
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  static create = async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      const response = await PermisoService.create(nombre, descripcion);
      if (response.error) {
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, { id: response.id }, response.message, response.code);
    } catch (error) {
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;
      const response = await PermisoService.update(id, nombre, descripcion);
      if (response.error) {
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, null, response.message, response.code);
    } catch (error) {
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      const response = await PermisoService.delete(id);
      if (response.error) {
        return ResponseProvider.error(res, response.message, response.code);
      }
      return ResponseProvider.success(res, null, response.message, response.code);
    } catch (error) {
      return ResponseProvider.error(res, "Error interno en el servidor", 500);
    }
  };
}

export default PermisoController;