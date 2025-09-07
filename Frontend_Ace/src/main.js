import './styles/index.js'
import { router } from './router/router.js';
import { headerController } from './controllers/headerController.js';

const header = document.querySelector("#header");
const app = document.querySelector("#app");


// Ejecuta el router en la carga inicial
window.addEventListener("DOMContentLoaded", () => {
  
  // Renderiza el header correcto al cargar la SPA
  headerController(header);
  router(app);
});

// Ejecuta el router cada vez que cambia el hash
window.addEventListener("hashchange", () => {
  
  // Renderiza el header correcto al cargar la SPA
  headerController(header);
  router(app);
});

