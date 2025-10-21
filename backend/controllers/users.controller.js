
import jwt from "jsonwebtoken";
//const jwt = require('jsonwebtoken');
import { hashPassword, comparePassword } from '../utils/encrypt.js';
//createUser,getUserByEmail,getUserById,updateUser,deleteUser,getUsers
import { createUser,getUserByEmail,getUserById,updateUser,deleteUser,getUsers } from '../models/users.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pa55w0rdJWT';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '60';

export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        rol: user.rol
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

//Login, agregar protección
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña requeridos'});
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email inválido'});
        }

        const ok = await comparePassword(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: 'Password inválido'});
        }

        const token = generateToken(user);
        //Solo se devuelve el usuario, sin contraseña
        const { password: _P, ...userSafe } = user;
        res.json({ user: userSafe, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

//Registrar usuario (revisar permisos/rutas solo para administradores)
async function saveUser(req, res) {
    try {
        const { nombre, email, password, rol } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Campos obligatorios'});
        }

        //Verificar existencia previa del correo
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'El correo ya existe'});
        }

        const hashed = await hashPassword(password);
        const user = await createUser({ nombre, email, password: hashed, rol });

        res.status(201).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

// Paginación y filtros
async function listUsers(req, res) {
    try {
        const { page = 1, pageSize = 10, rol, q } = req.query;
        const result = await getUsers({ page: Number(page), pageSize: Number(pageSize, rol, q )});
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

async function getUser(req, res) {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'No se encontró usuario'});
            //res.json(user);
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

async function updateUserC(req, res) {
    try {
        const id = req.params.id;
        const payload = { ...req.body };

        //hash
        if (payload.password) {
            payload.password = await hashPassword(payload.password);
        }

        const updated = await updateUser(id, payload);
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

async function deleteUserC(req, res) {
    try {
        const id = req.params.id;
        const deleted = await deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Usuario no encontrado'});
        } else {
            res.json({ message: 'Usuario eliminado', id: deleted.id});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

export {
    login,
    saveUser,
    listUsers,
    getUser,
    updateUserC,
    deleteUserC
};
















