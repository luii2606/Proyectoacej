
import * as validate from "../helpers/validaciones.js";
import * as solicitudes from "../helpers/solicitudes.js";
import { error, success } from "../helpers/alertas.js";

export const registroController = async (parametros = null) => {
  const formulario = document.getElementById("form");
  if (!formulario) return;

  // evita añadir listeners repetidos si la vista se vuelve a renderizar
  if (formulario.dataset.inited === "true") return;
  formulario.dataset.inited = "true";

  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const telefono = document.getElementById("telefono");
  const contrasena = document.getElementById("contrasena");
  const btn = document.getElementById("btnRegister");

  // VALIDACIONES (tus helpers)
  if (nombre) nombre.addEventListener("keydown", (e) => validate.validarTexto(e));
  if (telefono) telefono.addEventListener("keydown", (e) => validate.validarNumero(e));

  if (nombre) nombre.addEventListener("blur", (e) => { 
    validate.validarCampo(e); 
    validate.validarMinimo(nombre, 3); 
  });
  if (correo) correo.addEventListener("blur", (e) => { 
    validate.validarCampo(e); 
    validate.validarEmail(correo); 
  });
  if (telefono) telefono.addEventListener("blur", (e) => {
    validate.validarCampo(e);
    if (telefono.value && telefono.value.length !== 10) {
      validate.agregarError(telefono, "Debe tener 10 dígitos");
    }
  });
  if (contrasena) contrasena.addEventListener("blur", (e) => { 
    validate.validarCampo(e); 
    validate.validarContrasena(contrasena); 
  });

  // SUBMIT
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (btn) { btn.disabled = true; btn.textContent = "Registrando..."; }

    try {
      if (!validate.validarCampos(e)) {
        if (btn) { btn.disabled = false; btn.textContent = "Registrarse"; }
        return;
      }

      const datos = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        telefono: telefono.value.trim(),
        contrasena: contrasena.value
      };

      console.log("📤 Enviando datos al backend:", datos);

      const respuesta = await solicitudes.post("auth/register", datos);

      console.log("📥 Respuesta del backend:", respuesta);

      if (!respuesta) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se recibió respuesta del servidor.",
      });
      return;
    }

       if (respuesta.error) {
      await Swal.fire({
        icon: "error",
        title: "Registro fallido",
        text: respuesta.error, // <- Aquí se mostrará "El correo ya está registrado"
        confirmButtonText: "Entendido"
      });
      return;
    }

        await Swal.fire({
      icon: "success",
      title: "¡Listo!",
      text: respuesta.message || "Usuario creado con éxito",
      confirmButtonText: "Ir a login"
        });
       location.hash = "#/login";

    }catch (err) {
    console.error("❌ Error en registro:", err);
    await Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Ocurrió un error al registrar. Revisa la consola.",
    });
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Registrarse"; }
  }
});
};