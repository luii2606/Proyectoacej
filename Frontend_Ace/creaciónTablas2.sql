USE proyectoacej2;

DROP TABLE IF EXISTS permisos;
CREATE TABLE permisos( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(100),
    descripcion VARCHAR(200)
); 

-- Tabla de roles (antes era tipo_usuario)

DROP TABLE IF EXISTS roles; 
CREATE TABLE roles ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50) NOT NULL -- (cliente, admin, trabajador)
); 

-- Tabla de tipo_usuario (antes era roles)

DROP TABLE IF EXISTS tipo_usuario; 
CREATE TABLE tipo_usuario ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50) NOT NULL -- (manicurista, estilista, cosmetólogo, todo)
); 

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios ( 
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL, 
    contrasena VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    telefono INT,
    id_roles INT,
    id_tipo_usuario INT, 
    id_Estado_usuarios INT, 
    FOREIGN KEY (id_roles) REFERENCES roles(id), 
    FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuario(id),
    FOREIGN KEY (id_Estado_usuarios) REFERENCES Estado_usuarios(id)
);

DROP TABLE IF EXISTS servicios; 
CREATE TABLE servicios ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(100) NOT NULL, 
    descripcion TEXT, 
    precio DECIMAL(10,2), 
    id_tipo_usuario INT, 
    FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuario(id) 
);

DROP TABLE IF EXISTS tipo_modalidad; 
CREATE TABLE tipo_modalidad ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) NOT NULL -- (presencial, domicilio) 
);

DROP TABLE IF EXISTS orden; 
CREATE TABLE orden( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    fecha_servicio DATE NOT NULL, 
    hora_servicio TIME, 
    id_tipo_modalidad INT,
    id_servicios INT, 
    id_Estado_orden INT, 
    id_usuarios_orden INT,
    FOREIGN KEY (id_tipo_modalidad) REFERENCES tipo_modalidad(id),
    FOREIGN KEY (id_servicios) REFERENCES servicios(id), 
    FOREIGN KEY (id_Estado_orden) REFERENCES Estado_orden(id),
    FOREIGN KEY (id_usuarios_orden) REFERENCES usuarios_orden(id) 
);

DROP TABLE IF EXISTS usuarios_orden;
CREATE TABLE usuarios_orden( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_usuario_trabajador INT NOT NULL,
    id_usuario_cliente INT NOT NULL, 
    FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_usuario_trabajador) REFERENCES usuarios(id) 
);

DROP TABLE IF EXISTS Estado_orden;
CREATE TABLE Estado_orden( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(100)
);

DROP TABLE IF EXISTS Estado_usuarios; 
CREATE TABLE Estado_usuarios( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(100)
); 

DROP TABLE IF EXISTS permisos_tipo_usuario; 
CREATE TABLE permisos_tipo_usuario ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_permisos INT, 
    id_roles INT,
    FOREIGN KEY (id_permisos) REFERENCES permisos(id), 
    FOREIGN KEY (id_roles) REFERENCES roles(id) 
); 

DROP TABLE IF EXISTS productos; 
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT, 
    precio DECIMAL(10,2) NOT NULL,
    id_Estado_producto INT,
    FOREIGN KEY (id_Estado_producto) REFERENCES Estado_producto(id) 
);

ALTER TABLE productos 
ADD cantidad INT NOT NULL DEFAULT 0;

DROP TABLE IF EXISTS Estado_producto; 
CREATE TABLE Estado_producto( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(100)
); 

DROP TABLE IF EXISTS detalle_orden_producto; 
CREATE TABLE detalle_orden_producto ( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_orden INT NOT NULL,
    id_productos INT NOT NULL, 
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL, 
    FOREIGN KEY (id_orden) REFERENCES orden(id),
    FOREIGN KEY (id_productos) REFERENCES productos(id) 
);

DROP TABLE IF EXISTS factura; 
CREATE TABLE factura ( 
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP, 
    total DECIMAL(10,2) NOT NULL,  
    FOREIGN KEY (id_orden) REFERENCES orden(id) 
);

SELECT * FROM usuarios;
SELECT * FROM roles;
SELECT * FROM tipo_usuario;
