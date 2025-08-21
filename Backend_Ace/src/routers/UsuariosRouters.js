import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";



const router = express.Router();
// Creamos una instancia del controlador

// Obtener todos los usuarios
router.get("/", UsuarioController.getAllUsuarios);

// Obtener una categoría por ID
// router.get("/:id", CategoriaController.getCategoriaById);

// // Crear una nueva categoría
// router.post("/", camposCategoria, CategoriaController.createCategoria);

// // Actualizar una categoría
// router.put("/:id", camposCategoria, CategoriaController.updateCategoria);

// // Actualizar parcialmente una categoría
// router.patch("/:id", parcialesCategoria, CategoriaController.updateCategoria);

// // Eliminar una categoría
// router.delete("/:id", CategoriaController.deleteCategoria);

export default router;