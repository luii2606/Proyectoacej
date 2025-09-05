import {PermisoTipoUsuario} from "../models/permisosTipoUsuario.js";

class PermisoTipoUsuarioService {
  static async getAll() {
    try {
      const permisos_tipo_usuario = await PermisoTipoUsuario.getAll();
      return { error: false, code: 200, data: permisos_tipo_usuario };
    } catch (error) {
      return { error: true, code: 500, message: "Error al obtener permisos y tipo de usuario" };
    }
  }

  static async getById(id) {
    try {
      const permisos_tipo_usuario = await PermisoTipoUsuario.findById(id);
      if (!permisos_tipo_usuario) return { error: true, code: 404, message: "Permiso y tipo de usuario no encontrado" };
      return { error: false, code: 200, data: permisos_tipo_usuario };
    } catch (error) {
      return { error: true, code: 500, message: "Error al buscar permiso y tipo de usuario" };
    }
  }

  static async create(nombre) {
    try {
      const id = await PermisoTipoUsuario.create(nombre);
      return { error: false, code: 201, message: "Permiso y tipo de usuario creado", id };
    } catch (error) {
      return { error: true, code: 500, message: "Error al crear permiso y tipo de usuario" };
    }
  }

  static async update(id, nombre) {
    try {
      const updated = await PermisoTipoUsuario.update(id, nombre);
      if (!updated) return { error: true, code: 404, message: "Permiso y tipo de usuario no encontrado" };
      return { error: false, code: 200, message: "Permiso y tipo de usuario actualizado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al actualizar permiso y tipo de usuario" };
    }
  }

  static async delete(id) {
    try {
      const deleted = await PermisoTipoUsuario.delete(id);
      if (!deleted) return { error: true, code: 404, message: "Permiso y tipo de usuario no encontrado" };
      return { error: false, code: 200, message: "Permiso y tipo de usuario eliminado" };
    } catch (error) {
      return { error: true, code: 500, message: "Error al eliminar Permiso y tipo de usuario" };
    }
  }
}

export default PermisoTipoUsuarioService;