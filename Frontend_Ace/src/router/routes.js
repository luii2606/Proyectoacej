// import { trabajadoresController } from "../views/clientes/agendar-estilistas/trabajadoresController.js";
import { trabajadorController } from "../controllers/trabajadoresController.js";
import { loginController } from "../controllers/loginController.js";
import { registroController } from "../controllers/registroController.js";
import { agendarController } from "../controllers/agendarController.js";
import { estilistasController } from "../controllers/estilistasController.js";
import { productosController } from "../controllers/productosController.js";
import { productosClienteController } from "../controllers/productosClienteController.js";
import { ordenesTrabajadorController } from "../controllers/clientesController.js";
import { reservasController } from "../controllers/reservasContoller.js";
// import { FacturaController } from "../controllers/facturaController.js";



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
  agendarProductos: {
    path: "clientes/agendar/productos-cards.html", // tu nueva vista
    controller:productosClienteController, // controlador de esa vista
    private: false
  },
  verCitas:{
    path: "clientes/reservas/index.html",
    controller: reservasController,
    private: false
  },
  //  verFacturas:{
  //   path: "clientes/facturas/index.html",
  //   controller: FacturaController,
  //   private: false
  // },
  adminTrabajadores: {
    path: "admin/gestionTrabajadores/trabajadores-form.html", // tu nueva vista
    controller:trabajadorController, // controlador de esa vista
    private: false
  },

  tablaTrabajadores: {
    path: "admin/gestionTrabajadores/trabajadores-tabla.html", // tu nueva vista
    controller:trabajadorController, // controlador de esa vista
    private: false
  },

  productos: {
    path: "admin/gestionProductos/productos-form.html", // tu nueva vista
    controller:productosController, // controlador de esa vista
    private: false
  },

  tablaProductos: {
    path: "admin/gestionProductos/productos-tabla.html", // tu nueva vista
    controller:productosController, // controlador de esa vista
    private: false
  },
  movimientosTrabajador: {
    path: "admin/movimientos/index.html", // tu nueva vista
    controller:productosController, // controlador de esa vista
    private: false
  },
  visualizarFacturas: {
    path: "admin/facturas/index.html", // tu nueva vista
    controller:productosController, // controlador de esa vista
    private: false
  },
  visualizarCitasTrabajador: {
    path: "trabajadores/index.html", // tu nueva vista
    controller:ordenesTrabajadorController, // controlador de esa vista
    private: false
  },
  
}