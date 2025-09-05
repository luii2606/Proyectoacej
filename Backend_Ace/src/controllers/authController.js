import { ResponseProvider } from "../providers/ResponseProvider.js";
import AuthService from "../services/AuthService.js";

export const register = async (req, res) => {
  const { nombre, correo, telefono, contrasena } = req.body;
  try {
    const response = await AuthService.register(nombre, correo, telefono, contrasena);
    if (response.error) {
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.success(res, {}, response.message, response.code);
    } else {
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.error(res, response.message, response.code);
    }    
  } catch (error) {
    // Llamamos el provider para centralizar los mensajes de respuesta
    ResponseProvider.error(res, "Error en el servidor", 500);
  }
}

export const login = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const response = await AuthService.login(res, correo, contrasena);
    
    if (response.error) {
      console.log(response);
      
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.error(
        response.res,
        response.message,
        response.code
      );
    } else {
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.success(
        response.res,
        response.data,
        response.message,
        response.code
      );
    }
  } catch (error) {
    console.log(error);
    
    // Llamamos el provider para centralizar los mensajes de respuesta
    ResponseProvider.error(res, "Error en el servidor", 500);
  }
};

export const refresh = async (req, res) => {
  const {refreshToken} = req.cookies;
  
  const {user} = req;
  
  try {
    const response = await AuthService.refresh(res, user);
    
    if (response.error) {
      
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.error(
        response.res,
        response.message,
        response.code
      );
    } else {
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.success(
        response.res,
        response.data,
        response.message,
        response.code
      );
    }
  } catch (error) {
    console.log(error);
    
    // Llamamos el provider para centralizar los mensajes de respuesta
    ResponseProvider.error(res, "Error en el servidor", 500);
  }
}

export const logout = async (req, res) => {
  try {
    const response = await AuthService.logout(res);
    
    if (response.error) {
      console.log(response);
      
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.error(
        response.res,
        response.message,
        response.code
      );
    } else {
      // Llamamos el provider para centralizar los mensajes de respuesta
      ResponseProvider.success(
        response.res,
        response.data,
        response.message,
        response.code
      );
    }
  } catch (error) {
    console.log(error);
    
    // Llamamos el provider para centralizar los mensajes de respuesta
    ResponseProvider.error(res, "Error en el servidor", 500);
  }
}