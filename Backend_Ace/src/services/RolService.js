import { Rol } from "../models/Roles.js";

class RolService {
  static async getAll() {
    try {
      const roles = await new Rol().getAll();
      return { error: false, code: 200, data: roles };
    } catch (error) {
      return { error: true, code: 500, message: "Error al obtener roles" };
    }
  }

  static async getById(id) {
    try {
      const rol = await Rol.findById(id);
      if (!rol) return { error: true, code: 404, message: "Rol no encontrado" };
      return { error: false, code: 200, data: rol };
    } catch (error) {
      return { error: true, code: 500, message: "Error al buscar rol" };
    }
  }

  static async create(nombre) {
    try {
      const id = await Rol.create(nombre);
      return { error: false, code: 201, message: "Rol creado", id };
    } catch (error) {
      return { error: true, code: 500, message: "Error al crear rol" };
    }
  }

  static async update(id, nombre) {
    try {
      const updated = await Rol.update(id, nombre);
      if (!updated) return { error: true, code: 404, message: "Rol no encontrado" };
      return { error: false, code: 200, message: "Rol actualizado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al actualizar rol" };
    }
  }

  static async delete(id) {
    try {
      const deleted = await Rol.delete(id);
      if (!deleted) return { error: true, code: 404, message: "Rol no encontrado" };
      return { error: false, code: 200, message: "Rol eliminado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al eliminar rol" };
    }
  }
}

export default RolService;