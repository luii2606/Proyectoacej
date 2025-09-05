// import ResponseProvider from "../../providers/ResponseProvider.js";
// // import { getPermisos } from "../../utils/getPermisos.js";

// /**
//  * Middleware para verificar si el usuario tiene los permisos necesarios para acceder a una ruta.
//  * 
//  * Este middleware recibe una lista de permisos requeridos y compara si el usuario autenticado
//  * (ya presente en `req.user`) los tiene. Si no cumple, se bloquea el acceso con un error 403.
//  * 
//  * @param {...string} permisosRequeridos - Lista de permisos necesarios para acceder a la ruta.
//  * @returns {Function} Middleware Express que valida los permisos del usuario.
//  * 
//  * @example
//  * router.post("/usuarios", authenticate, authorize("usuario.crear"), controlador);
//  */
// const authorize = (...permisosRequeridos) => {
//     return async (req, res, next) => {
//         // Extrae los permisos del usuario desde el token decodificado        
//         const permisosUsuario = await getPermisos(req.user.id);
        
//         // Verifica si el usuario tiene todos los permisos requeridos
//         const tienePermiso = permisosRequeridos.every(requerido => {

//             // Para cada permiso requerido, buscamos si el usuario tiene algún permiso que lo cubra
//             return permisosUsuario.some(asignado => {

//                 // ✅ Coincidencia exacta: el permiso asignado es igual al requerido
//                 if (asignado === requerido) return true;

//                 // ✅ Coincidencia con comodín: por ejemplo, "tabla.*" cubre "tabla.crear", "tabla.editar", etc.
//                 if (asignado.endsWith(".*")) {
//                     // Extraemos la parte base del permiso, por ejemplo "tabla" desde "tabla.*"
//                     const base = asignado.replace(".*", "");

//                     // Verificamos si el permiso requerido comienza con esa base seguida de un punto
//                     // Ejemplo: "tabla.crear".startsWith("tabla.") → true
//                     return requerido.startsWith(base + ".");
//                 }

//                 // Si no hay coincidencia exacta ni por comodín, este permiso asignado no cubre el requerido
//                 return false;
//             });
//         });


//         // Si no tiene los permisos, se bloquea el acceso
//         if (!tienePermiso) {
//             return ResponseProvider.authError(
//                 res,
//                 "No tienes permiso para realizar esta acción",
//                 403,
//                 "PERMISSION_DENIED"
//             );
//         }

//         // Si todo está bien, continúa con la siguiente función
//         next();
//     };
// }

// export default authorize;