import { trabajadoresController } from "../views/clientes/agendar-estilistas/trabajadoresController.js";
import { loginController } from "../views/auth/Login/loginController.js";

export const routers = {
  "": {
    path: "auth/login/index.html",
    controller: loginController,
    private: false
  },
  login: {
    path: "auth/login/index.html",
    controller: loginController,
    private: false
  }
}