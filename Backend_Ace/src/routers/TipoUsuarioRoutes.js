import express from 'express';
import TipoUsuarioController  from '../controllers/TipoUsuarioController.js';


const router = express.Router();

router.get("/", TipoUsuarioController.getAllTipoUsuario);

export default router;