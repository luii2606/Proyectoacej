import './style.css'
import { router } from './router/router.js';
import { renderHeader } from './componentes/cliente/header.js';
import { renderheaderAdmin } from './componentes/administrador/header.js';
import { renderHeaderTrabajador } from './componentes/trabajador/header.js';
import { loginController } from './views/auth/Login/loginController.js';


// const header = document.querySelector("#header");
// const app = document.querySelector("#app");

// renderHeader(header)

// const headerAdmin = document.querySelector('#header-admin');
// renderheaderAdmin(headerAdmin)

// const headerTrabajador = document.querySelector('#header--trabajador')
// renderHeaderTrabajador(headerTrabajador)


const app = document.querySelector("#app");

// Inicializa el router cuando carga la página
window.addEventListener("DOMContentLoaded", () => router(app));

// Escucha cambios en el hash (cuando navegas entre rutas)
window.addEventListener("hashchange", () => router(app));
