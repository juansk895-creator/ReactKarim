import jwt from 'jsonwebtoken';

//getUserByEmail = findUserByEmail ?
import { createUser, getUserByEmail } from '../models/users.model.js';

//hashPassword = encryptPassword ?
import { hashPassword, comparePassword } from '../utils/encrypt.js';

//import { generateToken } from './users.controller.js'; // Se usa ?
import { pool } from '../db.js';

//Variables de entorno
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Función auxiliar
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET || "fallback_secret",{
        expiresIn: JWT_EXPIRES_IN || "1h",
    });
}

export async function registerUser(req, res) {
    try {
        const {
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            telefono,
            password,
            fecha_nacimiento,
            rol_id,
            status_id
        } = req.body;

        // Validaciones
        if (!nombre || !password || !email || !rol_id) {
            return res.status(400).json({ message: 'Faltan campos obligatorios'});
        }
        const userPrevio = await getUserByEmail(email);
        if (userPrevio) {
            return res.status(409).json({ message: 'El correo ha sido registrado previamente'});
        }

        //Encriptación
        const hashedPassword = await hashPassword(password);

        //Usuario
        const newUser = await createUser(
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            telefono,
            hashedPassword,
            fecha_nacimiento,
            rol_id || 'user', // Comprobar
            status_id || 'activo' // Comprobar
        );

        // token JWT
        //const token = generateToken(newUser);
        const token = generateToken({ id: newUser.id, rol: newUser.rol_id });

        return res.status(201).json({
            message: 'Usuario registrado con éxito',
            user: newUser,
            token
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        //return res.status(500).json({ message: 'Error interno del servidor'}); //Comprobar
        res.status(500).json({ message: 'Error interno del servidor'}); //Comprobar
    }
}

export async function loginUser(req, res) {

    const { email, password } =  req.body;

    try {
        //Validaciones
        if (!email || !password) {
            return res.status(400).json({ message: 'Se requiere email y contraseña'});
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no registrado'});
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta'});
        }
        const token = generateToken({ id: user.id, rol: user.rol_id });
        const { password: _, ...userData } = user;

        //res.json({ ok: true, token });
        res.status(200).json({ message: "Inicio de sesión exitoso", user: userData, token });
    } catch (error) {
        console.error('Error al hacer login:', error);
        return res.status(500).json({ message: 'Error interno del servidor'}); //Comprobar
    }
}
/*
export {
    registerUser,
    loginUser
};
*/