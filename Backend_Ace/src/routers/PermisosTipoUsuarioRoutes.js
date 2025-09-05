import express from "express";

import PermisoTipoUsuarioController from "../controllers/PermisosTipoUsuarioController.js";



const router = express.Router();

// Obtener todas las relaciones permiso-tipo-usuario
router.get("/", PermisoTipoUsuarioController.getAllPermisosTipoUsuario);

// Obtener una relación permiso-tipo-usuario por ID
router.get("/:id", PermisoTipoUsuarioController.getPermisoTipoUsuarioById);

// Crear una nueva relación permiso-tipo-usuario
router.post("/", PermisoTipoUsuarioController.createPermisoTipoUsuario);

// Actualizar una relación permiso-tipo-usuario
router.put("/:id", PermisoTipoUsuarioController.updatePermisoTipoUsuario);

// Actualizar una relación permiso-tipo-usuario parcialmente
router.patch("/:id", PermisoTipoUsuarioController.updatePermisoTipoUsuario);

// Eliminar una relación permiso-tipo-usuario
router.delete("/:id",PermisoTipoUsuarioController.deletePermisoTipoUsuario);

export default router;