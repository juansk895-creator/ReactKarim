-- Base de datos: react_db
-- Inicialización

DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS bitacora_users CASCADE;

-- tabla roles, tipos de usuarios
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
    -- administrador = puede ver y controlar todo, titular = puede ver todo, pero con control limitado, analista = solo puede ver y generar reportes
);

-- tabla status, permite restringir el acceso de un usuario sin tener que eliminarlo permanentemente
CREATE TABLE IF NOT EXISTS status (
    id SERIAL PRIMARY KEY,
    estado VARCHAR(10) NOT NULL UNIQUE
    --activo, inactivo
);

-- tabla users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_pat VARCHAR(50) NOT NULL,
    apellido_mat VARCHAR(50) NOT NULL,
    --Si bien se puede repetir nombre y apellidos por separado, el "full name" no debe ser igual
    email VARCHAR(50) NOT NULL UNIQUE,
    num_tel VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    fecha_nac DATE,
    rol_id INT NULL REFERENCES roles(id) ON DELETE SET NULL,
    status_id INT NULL REFERENCES status(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_full_name UNIQUE (nombre, apellido_pat, apellido_mat)
);

-- tabla bitacora_users, registro de cambios en la tabla de usuarios (log del crud)
CREATE TABLE bitacora_users (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed, primeros valores

-- insertar roles
INSERT INTO roles (nombre, descripcion) VALUES
('administrador', 'Puede ver y controlar todo el sistema'),
('titular', 'Puede ver todo, pero con control limitado'),
('analista', 'Solo puede ver y generar reportes');

-- insertar status
INSERT INTO status (estado) VALUES
('activo'),
('inactivo');

-- insertar usuario administrador de prueba
INSERT INTO users (nombre, apellido_pat, apellido_mat, email, num_tel, password, fecha_nac, rol_id, status_id, created_at)
VALUES (
    'Juan Antonio',
    'Gabriel',
    'Bolaños',
    'juansk895@gmail.com',
    '9512566889',
    '$2b$10$VpK3qjLtOaHgQY96n6GvGu9BsyG8Ed0OTKQZUs94x/Jn88aSzp7dG', -- hash de "admin123"
    '1994-03-18',
    (SELECT id FROM roles WHERE nombre = 'administrador'),
    (SELECT id FROM status WHERE estado = 'activo'),
    NOW()
);

-- Registro en bitácora
INSERT INTO bitacora_users (user_id, accion) VALUES
((SELECT id FROM users WHERE email = 'juansk895@gmail.com'), 'Registro de usuario');

