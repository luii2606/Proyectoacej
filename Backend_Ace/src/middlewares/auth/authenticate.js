// import dotenv from 'dotenv';
// import ResponseProvider from "../../providers/ResponseProvider.js";
// import jwt from 'jsonwebtoken';

// dotenv.config();

// // Clave secreta para verificar el access token
// const secretKey = process.env.ACCESS_TOKEN_SECRET;

// /**
//  * Middleware para verificar si el access token es válido.
//  * 
//  * Este middleware se usa en rutas protegidas para asegurar que el usuario esté autenticado.
//  * Si el token es válido, se adjunta el usuario decodificado a `req.user`.
//  * 
//  * @param {Object} req - Objeto de solicitud Express.
//  * @param {Object} res - Objeto de respuesta Express.
//  * @param {Function} next - Función para continuar con el siguiente middleware.
//  * 
//  * @example
//  * router.get("/protected", authenticate, controlador);
//  */
// const authenticate = (req, res, next) => {
//   const token = req.cookies.token;

//   // Si no hay token, se bloquea el acceso
//   if (!token) {
//     return ResponseProvider.authError(res, "Token no encontrado", 401, "TOKEN_MISSING");
//   }

//   try {
//     // Verifica y decodifica el token
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;

//     next();
//   } catch (err) {
//     // Si el token expiró
//     if (err.name === 'TokenExpiredError') {
      
//       return ResponseProvider.authError(res, 'Token expirado', 401, 'TOKEN_EXPIRED');
//     }

//     // Si el token es inválido
//     return ResponseProvider.authError(res, 'Token inválido', 401, 'TOKEN_INVALID');
//   }
// };

// export default authenticate;