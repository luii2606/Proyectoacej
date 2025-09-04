// import { trabajadoresController } from "../views/clientes/agendar-estilistas/trabajadoresController.js";
import { trabajadorController } from "../controllers/trabajadoresController.js";
import { loginController } from "../controllers/loginController.js";
import { registroController } from "../controllers/registroController.js";
import { agendarController } from "../views/clientes/agendar/agedarController.js";

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

  administrador: {
    path: "admin/movimientos/index.html",
    controller:trabajadorController,
    private: false,
    // permission: "trabajadores.view"
  },
  cliente: {
    path: "clientes/agendar/index.html",
    controller:agendarController,
    private: false
  }
}