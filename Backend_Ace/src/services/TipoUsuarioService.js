import { TipoUsuario } from "../models/TipoUsuario.js";

class TipoUsuarioService {
  static async getAll() {
    try {
      const tipoUsuario = await new TipoUsuario().getAll();
      return { error: false, code: 200, data: tipoUsuario };
    } catch (error) {
      return { error: true, code: 500, message: "Error al obtener el tipo de usuario" };
    }
  }

  static async getById(id) {
    try {
      const tipoUsuario = await TipoUsuario.findById(id);
      if (!tipoUsuario) return { error: true, code: 404, message: "tipo de usuario no encontrado" };
      return { error: false, code: 200, data: tipoUsuario };
    } catch (error) {
      return { error: true, code: 500, message: "Error al buscar tipo de usuario" };
    }
  }

  static async create(nombre) {
    try {
      const id = await TipoUsuario.create(nombre);
      return { error: false, code: 201, message: "tipo de usuario creado", id };
    } catch (error) {
      return { error: true, code: 500, message: "Error al crear tipo de usuario" };
    }
  }

  static async update(id, nombre) {
    try {
      const updated = await TipoUsuario.update(id, nombre);
      if (!updated) return { error: true, code: 404, message: "tipo de usuario no encontrado" };
      return { error: false, code: 200, message: "tipo de usuario actualizado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al actualizar tipo de usuario" };
    }
  }

  static async delete(id) {
    try {
      const deleted = await TipoUsuario.delete(id);
      if (!deleted) return { error: true, code: 404, message: "tipo de usuario no encontrado" };
      return { error: false, code: 200, message: "tipo de usuario eliminado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al eliminar tipo de usuario" };
    }
  }
}

export default TipoUsuarioService;