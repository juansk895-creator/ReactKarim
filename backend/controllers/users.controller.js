
import jwt from "jsonwebtoken";
//const jwt = require('jsonwebtoken');
import { hashPassword, comparePassword } from '../utils/encrypt.js';
import { createUser,getUserByEmail,getUserById,updateUser,updatePassword,
    deleteUser, getStatsRoles, getStatsStatus, getStatsAge, getUsers,
    getUserByIdForProfile, updateUserProfileById } from '../models/users.model.js';
import { registerBitacora } from "../utils/registerBitacora.js";
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
    rol_nombre: 'r.nombre',
    estado: 's.estado',
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

async function getMe(req, res) {
    try {
        const userId = req.user.id;
        const user = await getUserByIdForProfile(userId);

        if (!user) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado (backend)" });
        }
        return res.json({ ok: true, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Error obteniendo perfil (backend)" });
    }
}

async function updateMe(req, res) {
    try {
        const userId = req.user.id;

        const { nombre, apellido_pat, apellido_mat, email, num_tel, fecha_nac } = req.body;

        if (!nombre || !apellido_pat || !email) {
            return res.status(400).json({ ok: false, message: "Faltan campos obligatorios (no llegaron al backend)" });
        }

        // revisar nombre de variable
        const before = await getUserByIdForProfile(userId);
        if (!before) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado (backend)" });
        }

        const updated = await updateUserProfileById(userId, {
            nombre,
            apellido_pat,
            apellido_mat,
            email,
            num_tel,
            fecha_nac,
        });

        // Para la bitácora
        const changed = [];
        if ((before.nombre ?? "") !== (updated.nombre ?? "")) changed.push("nombre");
        if ((before.apellido_pat ?? "") !== (updated.apellido_pat ?? "")) changed.push("apellido paterno");
        if ((before.apellido_mat ?? "") !== (updated.apellido_mat ?? "")) changed.push("apellido materno");
        if ((before.email ?? "") !== (updated.email ?? "")) changed.push("email");
        if ((before.num_tel ?? "") !== (updated.num_tel ?? "")) changed.push("teléfono");
        if ((before.fecha_nac ?? "") !== (updated.fecha_nac ?? "")) changed.push("fecha de nacimiento");

        const detalle = changed.length ? ` (${changed.join(", ")})` : "";

        await registerBitacora({
            responsable: req.user,
            objetivo: updated,
            accion: `Actualizó su perfil${detalle}` // Revisar detalle, al pickear un campo, sin cambio, igual lo considera
            //accion: `Actualizó su perfil`
        });

        return res.json({ ok: true, user: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Error actualizando perfil (backend)" });
    }
}

//Registrar usuario (revisar permisos/rutas solo para administradores)
async function saveUser(req, res) {
    try {
        const {
            nombre,
            apellido_pat,
            apellido_mat,
            email,
            num_tel,
            password,
            fecha_nac,
            rol_id
        } = req.body;
        
        // Validaciones
        if (!nombre || !apellido_pat || !email || !num_tel || !password || !fecha_nac || !rol_id) {
            return res.status(400).json({ message: 'Campos obligatorios faltantes' });
        }

        // Correo duplicado
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'El correo ya existe'});
        }

        //Encriptación
        const hashed = await hashPassword(password);

        const status_id = 1;

        // users
        const user = await createUser(
            nombre,
            apellido_pat,
            apellido_mat,
            email,
            num_tel,
            hashed,
            fecha_nac,
            rol_id,
            status_id,
        );
        // bitacora_users
        await registerBitacora({
            responsable: req.user,
            objetivo: user,
            accion: `Registró al usuario ${user.nombre}`
        });

        res.status(201).json({
            message: "Usuario registrado con éxito",
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error interno durante el registro de usuario (users.controller.js)'});
    }
}

// Paginación y filtros
async function listUsers(req, res) {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const rawPerPage = parseInt(req.query.perPage || req.query.pageSize) || 10;
    //const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 10, 1), 100);
    const perPage = Math.min(Math.max(rawPerPage, 1), 100);
    
    const sortBy = req.query.sortBy || "created_at";
    const sortBySql = ALLOWED_SORT[sortBy] || "u.created_at";
    const sortDir = (req.query.sortDir || "").toLowerCase() === "asc" ? "ASC" : "DESC";
    const offset = (page - 1) * perPage;

    const params = [];
    let where = "WHERE 1=1";

    if (req.query.role) {
        params.push(req.query.role);
        where += ` AND u.rol_id = $${params.length}`;
    }
    if (req.query.status) {
        params.push(req.query.status);
        where += ` AND u.status_id = $${params.length}`;
    }
    if (req.query.q) {
        const q = `%${req.query.q}%`;
        params.push(q);
        //params.push(`%${req.query.q}%`);
        //where += ` AND (u.nombre ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.num_tel ILIKE $${params.length})`;
        where += ` AND (
            u.nombre ILIKE $${params.length}
            OR u.apellido_pat ILIKE $${params.length}
            OR u.apellido_mat ILIKE $${params.length}
            OR u.email ILIKE $${params.length}
            OR u.num_tel ILIKE $${params.length}
            OR r.nombre ILIKE $${params.length}
            OR s.estado ILIKE $${params.length}
        )`;
    }

    const fromSql = `
        FROM users u
        LEFT JOIN roles r ON r.id = u.rol_id
        LEFT JOIN status s ON s.id = u.status_id
        ${where}
    `;

    //const countSql = `SELECT COUNT(*)::int AS count FROM users u ${where}`;
    const countSql = `SELECT COUNT(*)::int AS count ${fromSql}`;
    
    const dataSql = ` SELECT
        u.id,
        u.nombre,
        u.apellido_pat,
        u.apellido_mat,
        u.email,
        u.num_tel,
        u.rol_id,
        u.status_id,
        r.nombre AS  rol_nombre,
        s.estado AS estado
        ${fromSql}
        ORDER BY ${sortBySql} ${sortDir}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const client = await pool.connect();
    try {
        const countRes = await client.query(countSql, params);
        const total = countRes.rows[0].count;
        const dataParams = params.concat([perPage, offset]);
        const dataRes = await client.query(dataSql, dataParams);

        res.json({
            ok: true,
            users: dataRes.rows,
            page,
            perPage,
            total,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
            sortBy, //: Object.keys(ALLOWED_SORT).find(k => ALLOWED_SORT[k] === sortBy) || 'created_at',
            sortDir: sortDir.toLowerCase(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: 'Error interno del servidor (users.controller)'});
    } finally {
        client.release();
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

        // users
        const updated = await updateUser(id, payload);
        // bitacora_users
        if (updated) {
            await registerBitacora({
                responsable: req.user,
                objetivo: updated,
                accion: `Actualizó la información del usuario ${updated.nombre}`
            });
        }
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

async function updateStatusC(req, res) {
    try {
        const id = req.params.id;
        const { status_id } = req.body;

        if (![1, 2].includes(status_id)) {
            return res.status(400).json({  message: "Estado inválido" });
        }

        //
        const before = await getUserById(id);
        if (!before) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const beforeStatusId = before.status_id;

        // users
        const updated = await updateUser(id, { status_id });
        if (!updated) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Texto personalizado para cada cambiod de estado
        const statusActual = (sid) => (sid === 1 ? "Activo" : "Inactivo");
        const accion = status_id === 1 ? "Reactivó" : "Desactivó";
        //const cambio = `${statusActual(beforeStatusId)} -> ${statusActual(status_id)}`;

        // bitacora_users
        await registerBitacora({
            responsable: req.user,
            objetivo: updated,
            accion: `${accion} al usuario ${updated.nombre}`// (estado: ${cambio})`
        });

        res.json({
            message: "Estado actualizado con éxito",
            user: updated
        });

        /*if (!updated) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            message: "Estado actualizado con éxito",
            user: updated
        });*/
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno" });
    }
}

async function updatePasswordC(req, res) {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const match = await comparePassword(currentPassword, user.password);
        //if (!user) { revisar validación
        if (!match) {
            return res.status(403).json({ message: "Contraseña actual incorrecta" });
        }

        // users
        const newHash = await hashPassword(newPassword);
        await updatePassword(id, newHash);
        // bitacora_users
        const isSelf = String(req.user.id) === String(id);
        const accion = isSelf ? " actualizó su contraseña " : ` actualizó la contraseña del usuario ${user.nombre}`;

        await registerBitacora({
            responsable: req.user,
            objetivo: user,
            accion
        });

        res.json({ message: "Contraseña actualizada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno" });
    }
}

async function deleteUserC(req, res) {
    try {

        const id = req.params.id;
        const user = await getUserById(id);
        // users
        const deleted = await deleteUser(id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Usuario no encontrado'});
        }/* else {
            res.json({ message: 'Usuario eliminado', id: deleted.id});
        }*/
        // bitacora_users
        await registerBitacora({
            responsable: req.user,
            objetivo: user,
            accion: `Eliminó al usuario ${user.nombre}`
        });

        res.json({ message: 'Usuario eliminado', id: deleted.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error interno'});
    }
}

async function getStatsRolesC(req, res) {
    try {
        const data = await getStatsRoles();
        res.json({ ok: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: 'Error al obtener estadísticas por rol'});
    }
}

async function getStatsStatusC(req, res) {
    try {
        const data = await getStatsStatus();
        res.json({ ok: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: 'Error al obtener estadísticas por status'});
    }
}

async function getStatsAgeC(req, res) {
    try {
        const data = await getStatsAge();
        res.json({ ok: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: 'Error al obtener estadísticas por edad'});
    }
}

export {
    login,
    getMe,
    updateMe, //
    saveUser, //bitácora
    updateStatusC, //bitácora
    updatePasswordC, //
    listUsers,
    getUser,
    updateUserC, //bitácora
    deleteUserC, //bitácora
    getStatsRolesC,
    getStatsStatusC,
    getStatsAgeC
};

