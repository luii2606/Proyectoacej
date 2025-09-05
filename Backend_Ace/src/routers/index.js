import roles from "./rolRoutes.js";
// import authRoutes from "./authRoutes.js";
// import protectedRoutes from "./protectedRoutes.js";
import PermisosRouters from './PermisosRouters.js';
import PermisosTipoUsuario from './PermisosTipoUsuarioRoutes.js';

const rutas = [
  { path: 'roles', router: roles },
  { path: 'permisos-tipo-usuario', router: PermisosTipoUsuario },
  { path: '/permisos', router: PermisosRouters }, 
  // { path: '/auth', router: authRoutes }, 
  // { path: '/protected', router: protectedRoutes }
]
export default rutas;