import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Usuario } from "../models/Usuario.js";

dotenv.config();

const secretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION;
const refreshExpiration = process.env.REFRESH_EXPIRATION;

class AuthService {
  /**
   *
   * @param {*} nombre
   * @param {*} correo
   * @param {*} telefono
   * @param {*} contrasena
   * @returns
   */
  static async register(nombre, correo, telefono, contrasena) {
    try {
      // Verificar si el usuario ya existe
      const userExists = await Usuario.findByEmail(correo);
      // Validamos si el correo ya esta registrado en la base de datos
      if (userExists)
        return { error: true, code: 401, message: "El correo ya se encuentra registrado en el sistema" };
      // Hashear la contraseña || encriptar la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      // Registramos el usuario en la base de datos
      const userId = await Usuario.create( nombre, correo, telefono,  hashedPassword);
      // Retornamos la respuesta
      return { error: false, code: 201, message: "Usuario creado" };
    } catch (error) {      
      console.log(error);
      
      return { error: true, code: 500, message: "Error al crear el usuario" };
    }
  }
  /**
   *
   * @param {*} correo
   * @param {*} contrasena
   * @returns
   */
  static async login(res, correo, contrasena) {
    try {
      // Consultamos el usuario por el correo
      const user = await Usuario.findByEmail(correo);
      // Validamos si el usuario esta registrado en la base de datos      
      if (!user)
        return {
          error: true,
          code: 401,
          message: "Este correo no ha sido registrado.",
          res
        };
      // Comparmamos la contraseña del usuarios registrado con la ingresada basado en la llave de encriptación
      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      // Validamos si la contraseña es la misma
      if (!validPassword)
        return {
          error: true,
          code: 401,
          message: "El correo o la contraseña proporcionados no son correctos.",
          res
        };

      const token = await this.genToken(secretKey, user);

      const refreshToken = await this.genRefreshToken(refreshSecretKey, user);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      })

      return { error: false, code: 200, message: "Login exitoso", 
        data: {
          user_id: user.id,
          id_tipo_usuario: user.id_tipo_usuario
        },
        res
       };
      
    } catch (error) {     
      console.log(error);
      
      return { error: true, code: 500, message: "Error al loguearse", res };
    }
  }

  static async refresh(res, user) {
    try {

      const nuevoToken = await this.genToken(secretKey, user);
      
      res.cookie('token', nuevoToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      });

      console.log(`servicio: ${user}`);
      
      return { error: false, code: 200, message: "Token renovado exitosamente", 
        data: {
          user_id: user.id,
          id_tipo_usuario: user.id_tipo_usuario
        },
        res
      };

    } catch (error) {
      console.log(error);
      return { error: true, code: 500, message: "Error al renovar el token", res };
    }
  }
  
  static async genToken(keyToken, user) {
    return await jwt.sign(
        {
          id: user.id,
          id_tipo_usuario: user.id_tipo_usuario
        },
        keyToken, 
        {
          expiresIn: tokenExpiration
        }
    );
  }

  static async genRefreshToken(keyRefreshToken, user) {
    return await jwt.sign(
        {
          id: user.id,
          id_tipo_usuario: user.id_tipo_usuario
        },
        keyRefreshToken, 
        {
          expiresIn: refreshExpiration
        }
    );
  }

  static async logout(res) {
    try {
      
      res.clearCookie('token');

      return { error: false, code: 200, message: "Sesión cerrada con éxito", res };

    } catch (error) {
      return { error: true, code: 500, message: "Error al cerrar sesión", res };
    }
  }
}



export default AuthService;