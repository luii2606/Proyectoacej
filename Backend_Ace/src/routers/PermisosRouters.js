import express from 'express';
import PermisoController from '../controllers/PermisosController.js';


const router = express.Router();

router.get("/", PermisoController.getAll);
// Obtener todos los permisos

// Obtener un permiso por ID
router.get("/:id", PermisoController.getById);

// Crear un permiso
router.post("/", PermisoController.create);

// Actualizar un permiso
router.put("/:id", PermisoController.update);

// Eliminar un permiso
router.delete("/:id", PermisoController.delete);


export default router;