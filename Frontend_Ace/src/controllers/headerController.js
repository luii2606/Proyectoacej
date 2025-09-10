// src/componentes/headerController.js
import { renderheaderIncio } from "../componentes/inicio/header.js";
import { renderHeader } from "../componentes/cliente/header.js";
import { renderheaderAdmin } from "../componentes/administrador/header.js";
import { renderHeaderTrabajador } from "../componentes/trabajador/header.js";
import { logout } from "../helpers/auth.js"; // ajusta la ruta a donde tengas tu logout

export function headerController(container) {
  const idTipoUsuario = localStorage.getItem("id_tipo_usuario");

  // Limpia el header antes de renderizar
  container.innerHTML = "";

  switch (idTipoUsuario) {
    case "2": // cliente
      renderHeader(container);
      attachLogout(container);
      break;
    case "1": // administrador
      renderheaderAdmin(container);
      attachLogout(container);
      break;
    case "3": // trabajador
      renderHeaderTrabajador(container);
      attachLogout(container);
      break;
    default: // inicio (login o visitante)
      renderheaderIncio(container);
      attachLogout(container);
      break;
  }
}

//  función que engancha el logout al botón del header
function attachLogout(container) {
  const btn = container.querySelector("#logout-btn"); 
  if (btn) {
    btn.addEventListener("click", () => {
      logout();
      headerController(container); // refresca al header de inicio
      window.location.hash = "#/login"; // redirige a login
    });
  }
}

