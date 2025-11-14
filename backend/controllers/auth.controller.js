import jwt from 'jsonwebtoken';

//getUserByEmail = findUserByEmail ?
import { createUser, getUserByEmail } from '../models/users.model.js';

//hashPassword = encryptPassword ?
import { hashPassword, comparePassword } from '../utils/encrypt.js';

import { generateToken } from '../utils/jwt.js';
import { pool } from '../db.js';

//Variables de entorno
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export async function registerUser(req, res) {



    try {
        const {
            nombre,
            apellido_pat,
            apellido_mat,
            email,
            num_tel,
            password,
            fecha_nac,
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
            apellido_pat,
            apellido_mat,
            email,
            num_tel,
            hashedPassword,
            fecha_nac,
            rol_id || 'user', // Comprobar
            status_id || 'activo' // Comprobar
        );

        // token JWT
        //const token = generateToken(newUser);
        const token = generateToken(user);

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
        const token = generateToken(user);

        console.log("TOKEN GENERADO EN LOGIN: ", token);

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