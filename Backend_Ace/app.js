import express from "express";
// import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rutas from './src/routers/index.js';
// import authRoutes from "./src/routers/authRoutes.js";
// import protectedRoutes from "./src/routers/protectedRoutes.js";
// import rolRoutes from "./src/routers/rolRoutes.js";
// import TipoUsuarioRouters from "./src/routers/TipoUsuarioRoutes.js";

dotenv.config();

// Crear la instancia de Express
const app = express();
// Middleware
// Habilita CORS
app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
})); 
// Permite que la app acepte datos JSON
app.use(bodyParser.json()); 
// app.use(express.json());
// Permite el envio de datos de tipo utlencode
app.use(express.urlencoded({ extended: true }));
// Permite manejar cookies en las respuestas.
app.use(cookieParser());
// Rutas

rutas.forEach(({ path, router }) => { // Itera sobre las rutas definidas
  app.use('/api' + path, router); // Asocia cada ruta con su respectivo router
});
// Puerto para ejecutar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
