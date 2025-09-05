import express from 'express';
import RolController  from '../controllers/rolController.js';


const router = express.Router();

router.get("/", RolController.getAllRoles);

export default router;