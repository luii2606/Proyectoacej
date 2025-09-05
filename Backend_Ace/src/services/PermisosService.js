import { Permiso } from "../models/permisos.js"

class PermisoService {
  static async getAll() {
    try {
      const permisos = await new Permiso().getAll();
      return { error: false, code: 200, data: permisos };
    } catch (error) {
      console.error(error);
      return { error: true, code: 500, message: "Error al obtener permisos" };
    }
  }

  static async getById(id) {
    try {
      const permiso = await Permiso.findById(id);
      if (!permiso) return { error: true, code: 404, message: "Permiso no encontrado" };
      return { error: false, code: 200, data: permiso };
    } catch (error) {
      return { error: true, code: 500, message: "Error al buscar permiso" };
    }
  }

  static async create(nombre, descripcion) {
    try {
      const id = await Permiso.create(nombre, descripcion);
      return { error: false, code: 201, message: "Permiso creado", id };
    } catch (error) {
      return { error: true, code: 500, message: "Error al crear permiso" };
    }
  }

  static async update(id, nombre, descripcion) {
    try {
      const updated = await Permiso.update(id, nombre, descripcion);
      if (!updated) return { error: true, code: 404, message: "Permiso no encontrado" };
      return { error: false, code: 200, message: "Permiso actualizado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al actualizar permiso" };
    }
  }

  static async delete(id) {
    try {
      const deleted = await Permiso.delete(id);
      if (!deleted) return { error: true, code: 404, message: "Permiso no encontrado" };
      return { error: false, code: 200, message: "Permiso eliminado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al eliminar permiso" };
    }
  }
}

export default PermisoService;