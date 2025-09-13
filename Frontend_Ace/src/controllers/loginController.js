import * as solicitudes from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

export function loginController() {
  const formulario = document.querySelector('#form');
  if (!formulario) return;

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      correo: document.querySelector('#correo').value.trim(),
      contrasena: document.querySelector('#contrasena').value.trim()
    };

    if (!datos.correo || !datos.contrasena) {
      error("Debes ingresar correo y contraseña");
      return;
    }

    try {
      let response = await solicitudes.post('auth/login', datos);

      console.log("Respuesta login:", response);

      if (response.error) {
        error(response.error);
        return;
      }

      if (response.access_token) {
        let confirmacion = await success("Login exitoso");
        if (confirmacion.isConfirmed) {
          // Guardar tokens en localStorage
          console.log(response.id_usuario);
          localStorage.setItem("id_usuario", response.id_usuario);
          
          localStorage.setItem("access_token", response.access_token);
          // localStorage.setItem("", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
          localStorage.setItem("id_roles", response.id_roles);


          console.log("roles:", response.id_roles);

          // 🔹 Guardar también al usuario en sessionStorage
          const usuario = {
            id: response.id,
            nombre: response.nombre,
            correo: response.correo,
            id_tipo_usuario: response.id_tipo_usuario,
            id_roles: response.id_roles
            
          };
          
          
          
          sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

          const roles = Number(response.id_roles);

          // Redirección según tipo_usuario
          switch (roles) {
            case 1: // Admin
              window.location.href = '#/adminTrabajadores';
              break;
            case 2: // Usuario normal (cliente)
              window.location.href = '#/cliente';
              break;
            case 3: // Trabajador
              window.location.href = '#/visualizarCitasTrabajador';
              break;
            default:
              window.location.href = '#/login'; // Fallback
          }
        }
      } else {
        error("Respuesta inesperada del servidor");
      }

    } catch (err) {
      console.error("❌ Error en login:", err);
      error("Ocurrió un error al intentar iniciar sesión");
    }
  });
}
