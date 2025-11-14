
import jwt from "jsonwebtoken";
//const jwt = require('jsonwebtoken');
import { hashPassword, comparePassword } from '../utils/encrypt.js';
//createUser,getUserByEmail,getUserById,updateUser,deleteUser,getUsers
import { createUser,getUserByEmail,getUserById,updateUser,deleteUser,getUsers } from '../models/users.model.js';

import { pool } from "../db.js";
import { generateToken } from "../utils/jwt.js";

const JWT_SECRET = process.env.JWT_SECRET || 'pa55w0rdJWT';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Ordenamiento
const ALLOWED_SORT = {
    nombre: 'u.nombre',
    email: 'u.email',
    num_tel: 'u.num_tel',
    rol_id: 'u.rol_id',
    status_id: 'u.status_id',
    created_at: 'u.created_at',
};


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
        //Prueba con datos fijos
        const nombre = "Julio César";
        const apellido_pat= "Gabriel";
        const apellido_mat= "Bolaños";
        const email = "avecesar@gmail.com";
        const num_tel = "9512566890";
        const password = "password1";
        const fecha_nac = "1990-01-01";
        const rol_id = 2; //Titular
        //
        ////const { nombre, email, password, rol } = req.body;
        ////if (!nombre || !email || !password) {
            ////return res.status(400).json({ message: 'Campos obligatorios'});
        ////}

        //Verificar existencia previa del correo
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'El correo ya existe'});
        }

        //Encriptación
        const hashed = await hashPassword(password);

        //
        const user = await createUser(
            nombre,
            apellido_pat,
            apellido_mat,
            email,
            num_tel,
            hashed,
            fecha_nac,
            rol_id,
            1,
        );

        res.status(201).json({
            message: "Usuario registrado con éxito",
            user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error interno durante el registro de usuario'});
    }
}

// Paginación y filtros
async function listUsers(req, res) {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 10, 1), 100);
    const sortBy = ALLOWED_SORT[req.query.sortBy] || 'u.created_at';
    const sortDir = (req.query.sortDir || '').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const offset = (page - 1) * perPage;

    const params = [];
    let where = 'WHERE 1=1';

    if (req.query.role) {
        params.push(req.query.role);
        where += `AND u.rol_id = $${params.length}`;
    }
    if (req.query.status) {
        params.push(req.query.status);
        where += `AND u.status_id = $${params.length}`;
    }
    if (req.query.q) {
        params.push(`%${req.query.q}%`);
        where += `AND (u.nombre ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.num_tel ILIKE $${params.length})`;
    }

    const countSql = `SELECT COUNT(*)::int AS count FROM users u ${where}`;
    const dataSql = `
        SELECT u.id, u.nombre, u.email, u.num_tel, u.rol_id, u.status_id
        FROM users u
        ${where}
        ORDER BY ${sortBy} ${sortDir}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const client = await pool.connect();
    try {
        const countRes = await client.query(countSql, params);
        const total = countRes.rows[0].count;
        const dataParams = params.concat([perPage, offset]);
        const dataRes = await client.query(dataSql, dataParams);

        res.json({
            data: dataRes.rows,
            page,
            perPage,
            total,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
            sortBy: Object.keys(ALLOWED_SORT).find(k => ALLOWED_SORT[k] === sortBy) || 'created_at',
            sortDir: sortDir.toLowerCase(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor'});
    } finally {
        client.release();
    }


    /*try {
        const { page = 1, pageSize = 10, rol, q } = req.query;
        const result = await getUsers({ page: Number(page), pageSize: Number(pageSize, rol, q )});
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }*/
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

