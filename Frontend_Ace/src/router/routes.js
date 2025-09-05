// import { trabajadoresController } from "../views/clientes/agendar-estilistas/trabajadoresController.js";
import { trabajadorController } from "../controllers/trabajadoresController.js";
import { loginController } from "../controllers/loginController.js";
import { registroController } from "../controllers/registroController.js";
import { agendarController } from "../controllers/agendarController.js";
import { estilistasController } from "../controllers/estilistasController.js";

export const routers = {
   login: {
    path: "auth/Login/index.html",
    controller:loginController,
    private: false
  },

  registro: {
    path: "auth/registro/index.html",
    controller:registroController,
    private: false
  },
  cliente: {
    path: "clientes/agendar-estilistas/index.html",
    controller:estilistasController,
    private: false
  },

  agendar: {
    path: "clientes/agendar/index.html", // tu nueva vista
    controller:agendarController, // controlador de esa vista
    private: false
  },
  adminTrabajadores: {
    path: "admin/gestionTrabajadores/trabajadores-form.html", // tu nueva vista
    controller:trabajadorController, // controlador de esa vista
    private: false
  },
  tablaTrabajadores: {
    path: "admin/gestionTrabajadores/trabajadores-tabla.html", // tu nueva vista
    controller:trabajadorController, // controlador de esa vista
    private: false
  }
}