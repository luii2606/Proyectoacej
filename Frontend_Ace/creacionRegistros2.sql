-- inserts
INSERT INTO permisos (nombre, descripcion) VALUES
('usuarios.index', 'Listar todos los usuarios'),
('usuarios.create', 'Crear usuarios'),
('usuarios.delete', 'Eliminar usuarios'),
('productos.create', 'Crear productos'),
('productos.update', 'editar productos'),
('productos.delete', 'eliminar productos'),
('productos.index', 'Listar todos los productos'),
('movimientostrabajador.index', 'listar todas las citas'),
('facturas.index', 'listar todas las facturas'),
('Orden.index', 'Listar todas las ordenes'),
('Orden.create', 'crear una orden'),
('Orden.update', 'Editar estado de las ordenes');

INSERT INTO roles (nombre) VALUES
('Administrador'),
('Cliente'),
('Trabajador');
insert into permisos_tipo_usuario (id_permisos,id_roles) values 
  (1,1),
  (2,1),
  (3,1),
  (4,1),
  (5,1),
  (6,1),
  (7,1),
  (8,1),
  (9,1),
  (10,2),
  (10,3),
  (11,2),
  (12,2),
  (12,3);
  
INSERT INTO tipo_usuario ( nombre) VALUES
('Estilista'),
('Manicurista'),
('especialista en pestañas');
  
  -- usuarios
INSERT INTO usuarios
(nombre, contrasena, correo, telefono, id_roles, id_tipo_usuario, id_Estado_usuarios)
VALUES
('Luisa', '$2a$12$uCJrSY.zWxq95fjINVt.euBk5z6p.UqUfBVY994qMDWQRXC9nVCoK', 'luisa@gmail.com', 320488215, 1, 1, 1),
('Yesica', '$2a$12$qXpdMcmNPVMNza7NKPeiWe.HBj5mCg8hUjnT6Go1Hny/Ou0RQY4pW', 'yesica@gmail.com', 320435813, 3, 1, 1),
('Astrid', '$2a$12$OaE3uZ47PfYYXz9RCIDTqeZL2RwOoI4wMQUhm5oM8YNBNZMSV5lgy', 'astrid@gmail.com', 321598476, 3, 2, 1),
('Clienteuno', '$2a$12$azPcUbJyUPSAinSPSy/hjOlPFex1TpJVE.F898xeh5jW5wuSw2A4u', 'clienteuno@gmail.com', 314759862, 2, NULL, 1);

  -- pppppp
INSERT INTO servicios (nombre, descripcion, precio, id_tipo_usuario) VALUES
('Corte de cabello', 'Corte profesional de cabello para dama', 15000.00, 1),
('Peinado', 'Peinados para eventos especiales', 30000.00, 1),
('Tinte', 'Aplicación de tinte completo', 50000.00, 1),
('Manicure tradicional', 'Manicure básico tradicional', 15000.00, 2),
('Pedicure tradicional', 'Pedicure completo', 15000.00, 2),
('Manicura semipermanente', 'El esmaltado tiene una duración de un mes', 35000.00, 2),
('Pedicure semipermanente', 'El esmaltado tiene una duración de un mes', 35000.00, 2),
('Pestañas punto a punto', 'Pestañas con una duración de 15 días', 25000.00, 3),
('Pestañas pelo a pelo', 'Pestañas con una duración de 1 mes', 60000.00, 3);

 
 INSERT INTO tipo_modalidad (nombre) VALUES
('Presencial'),
('Domicilio');

-- orden

-- usuarios orden

 INSERT INTO Estado_orden (nombre) VALUES
('Pendiente'),
('Confirmada'),
('Completada'),
('Cancelada');
select * from estado_usuarios;
ALTER TABLE Estado_usuarios AUTO_INCREMENT = 1;

INSERT INTO Estado_usuarios (nombre) VALUES
('Activo'),
('Inactivo');


INSERT INTO productos (nombre_producto, descripcion, precio, id_Estado_producto, cantidad) VALUES
('Esmalte Rojo', 'Esmalte de uñas color rojo intenso', 12000.00, 1, 20),
('Shampoo Herbal', 'Shampoo natural para todo tipo de cabello', 18000.00, 1, 15),
('Mascarilla Facial', 'Mascarilla hidratante con aloe vera', 25000.00, 1, 10);

INSERT INTO Estado_producto (nombre) VALUES
('Disponible'),
('Agotado');

-- detalle_orden_producto

-- factura

