INSERT INTO permisos (nombre, descripcion) VALUES
('usuarios.index', 'Listar todos los usuarios'),
('usuarios.view', 'Listar un usuario'),
('usuarios.create', 'Crear usuarios'),
('usuarios.update', 'Actualizar/editar los usuarios'),
('usuarios.delete', 'Eliminar usuarios'),
('trabajadores.view', 'Acceder al CRUD de los trabajadores');

INSERT INTO tipo_usuario (id, nombre) VALUES
(1, 'Administrador'),
(2, 'Cliente'),
(3, 'Trabajador');

INSERT INTO roles (nombre) VALUES
('Administrador'),
('Cliente'),
('Trabajador');

-- usuarios

INSERT INTO servicios (id, nombre, descripcion, precio, id_roles) VALUES
(1, 'Corte de cabello', 'Corte profesional de cabello para dama', 15000.00, 1),
(2, 'Peinado', 'Peinados para eventos especiales', 30000.00, 1),
(3, 'Tinte', 'Aplicación de tinte completo', 50000.00, 1),
(4, 'Manicure tradicional', 'Manicure básico tradicional', 15000.00, 2),
(5, 'Pedicure tradicional', 'Pedicure completo', 15000.00, 2),
(6, 'Manicura semipermanente', 'El esmaltado tiene una duración de un mes', 35000.00, 2),
(7, 'Pedicure semipermanente', 'El esmaltado tiene una duración de un mes', 35000.00, 2),
(8, 'Pestañas punto a punto', 'Pestañas con una duración de 15 días', 25000.00, 3),
(9, 'Pestañas pelo a pelo', 'Pestañas con una duración de 1 mes', 60000.00, 3),
(10, 'Pestañas pelo a pelo', 'Pestañas con una duración de 1 mes', 60000.00, 3);

INSERT INTO tipo_modalidad (id, nombre) VALUES
(1, 'presencial'),
(2, 'domicilio');


INSERT INTO orden (id, fecha_servicio, hora_servicio, id_tipo_modalidad, id_servicios, id_Estado_orden, id_usuarios_orden) VALUES
(29, '2025-09-09', '16:00:00', 1, 1, 1, 38),
(31, '2025-09-17', '17:00:00', 2, 3, 1, 40),
(33, '2025-09-26', '10:00:00', 1, 1, 1, 42),
(38, '2025-09-18', '13:00:00', 1, 2, 1, 47),
(39, '2025-09-12', '12:00:00', 2, 3, 1, 48),
(40, '2025-09-19', '11:00:00', 1, 1, 1, 49);

INSERT INTO estado_orden (id, nombre) VALUES
(1, 'pendiente'),
(2, 'confrimada'),
(3, 'completada'),
(4, 'cancelada');

INSERT INTO estado_usuarios (id, nombre) VALUES
(1, 'Activo'),
(2, 'Inactivo');

INSERT INTO permisos_tipo_usuario (id, id_permisos, id_tipo_usuario) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 11, 1);
INSERT INTO estado_productos (id, nombre) VALUES
(1, 'Activo'),
(2, 'Agotado');

INSERT INTO productos (id, nombre_producto, descripcion, precio, id_Estado_producto, cantidad) VALUES
(5, 'tratamiento de coconout', 'Hidrata el cabello', 40000.00, 1, 18),
(6, 'aceite de coco', 'restaurar puntas dañadas', 40000.00, 1, 5);

SET foreign_key_checks = 0; 
SET foreign_key_checks = 1; 
select * from estado_producto;
select* from orden;
select * from usuarios_orden;
select * from usuarios;
delete from orden where id= 14;
select * from  usuarios_orden;
select * from productos;
select *from detalle_orden_producto;
select * from servicios;
select * from detalle_orden_producto;
select * from usuarios;
select * from orden;
delete from orden where id <29;
select * from productos;
SET foreign_key_checks = 0; 
SET foreign_key_checks = 1; 




     
            
            select * from usuarios;