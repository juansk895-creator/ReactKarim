
//const pool = require('../db.js'); //db.js debe exportar pool:
import { pool } from "../db.js";
const DEFAULT_PAGE_SIZE = 10;

//User - nombre, apellido paterno, apellido materno, email, teléfono, password, 
//fecha de nacimiento, rol, status, created_at, updated_at
async function createUser(nombre, apellido_pat, apellido_mat, email, num_tel, password, fecha_nac, rol_id, status_id = 1) {
    const sql = `
        INSERT INTO users (nombre, apellido_pat, apellido_mat, email, num_tel, password, fecha_nac, rol_id, status_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id, nombre, apellido_pat, apellido_mat, email, num_tel, password, fecha_nac, rol_id, status_id, created_at, updated_at;
    `;
    const values = [nombre, apellido_pat, apellido_mat, email, num_tel, password, fecha_nac, rol_id, status_id];
    const { rows } = await pool.query(sql, values);
    return rows[0];
}

/*async function createUser({ name, email, password, role = 'user', status = 'activo', }) {
    const sql = `
        INSERT INTO users (name, email, password, role, status, created_at)
    `;
    const values = [name, email, password, role, status];
    const { rows } = await pool.query(sql, values);
    return rows[0];
}*/

async function getUserByEmail(email) {
    const { rows } = await pool.query(
        `SELECT
            id, nombre, email, password, rol_id, status_id
        FROM users WHERE email = $1 LIMIT 1`,
        [email]
    );
    return rows[0];
}

async function getUserById(id) {
    const { rows } = await pool.query(
        `SELECT
            id, nombre, apellido_pat, apellido_mat, email,
            num_tel, fecha_nac, rol_id, status_id, created_at
        FROM users WHERE id = $1`, [id]
    );
    return rows[0];
}

async function updateUser(id, { nombre, apellido_pat, apellido_mat, email, num_tel, fecha_nac, rol_id, status_id, password }) {
    const parts = [];
    const values = [];
    let idx = 1;
/*
const sql = `UPDATE users SET ${parts.join(', ')} WHERE id = $${idx} RETURNING id,
name, email, role, status, created_at;`;
  values.push(id);
*/
    if (nombre !== undefined) { parts.push(`nombre = $${idx++}`); values.push(nombre); }
    if (apellido_pat !== undefined) { parts.push(`apellido_pat = $${idx++}`); values.push(apellido_pat); }
    if (apellido_mat !== undefined) { parts.push(`apellido_mat = $${idx++}`); values.push(apellido_mat); }
    if (email !== undefined) { parts.push(`email = $${idx++}`); values.push(email) }
    if (num_tel !== undefined) { parts.push(`num_tel = $${idx++}`); values.push(num_tel) }
    if (fecha_nac !== undefined) { parts.push(`fecha_nac = $${idx++}`); values.push(fecha_nac) }
    if (rol_id !== undefined) { parts.push(`rol_id = $${idx++}`); values.push(rol_id) }
    if (status_id !== undefined) { parts.push(`status_id = $${idx++}`); values.push(status_id) }
    if (password !== undefined) { parts.push(`password = $${idx++}`); values.push(password) }

    if (parts.length === 0) return getUserById(id);

    const sql = `
        UPDATE users SET ${parts.join(',')}
        WHERE id = $${idx}
        RETURNING id, nombre, apellido_pat, apellido_mat, email, num_tel, fecha_nac, rol_id, status_id, created_at, updated_at;`;
    values.push(id);

    const { rows } = await pool.query(sql, values);
    return rows[0];

}

async function updatePassword(id, hashedPassword) {
    const { rows } = await pool.query(
        `UPDATE users SET password = $1 WHERE id = $2 RETURNING id`,
        [hashedPassword, id]
    );
    console.log("HASH GUARDADO:", hashedPassword);
    return rows[0];
}

async function deleteUser(id) {
    const { rows } = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING id;`,
        [id]
    );
    return rows[0];
}

/** trabajar funciones
 * getUsers con paginación y filtros:
 *  - page (1-based)
 *  - pageSize
 *  - role (string) -> filtro por rol
 *  - q -> búsqueda por name OR email (ilike %q%)
 */

async function getUsers({ page = 1, pageSize = DEFAULT_PAGE_SIZE, rol_id, q }) {
    const where = [];
    const values = [];
    let idx = 1;

    if (rol_id) {
        where.push(`rol_id = $${idx++}`);
        values.push(rol_id);
    }
    if (q) {
        where.push(`(nombre ILIKE $${idx} OR email ILIKE $${idx})`);
        values.push(`%${q}%`);
        idx++;
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const offset = (page -1) * pageSize;

    const sql = `
        SELECT id, nombre, email, rol_id, status_id, created_at
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(pageSize, offset);

    const countSql = `SELECT COUNT(*):: int AS total FROM users ${whereClause};`;

    const [dataRes, countRes] = await Promise.all([
        pool.query(sql, values),
        // same where values
        pool.query(countSql, values.slice(0, values.length - 2))
    ]);

    return {
        data: dataRes.rows,
        total: countRes.rows[0] ? countRes.rows[0].total : 0,
        page,
        pageSize
    };
}

// Estadísticas
async function getStatsRoles() {
    const sql = `
        SELECT rol_id, COUNT(*)::int AS total
        FROM users
        GROUP BY rol_id
        ORDER BY rol_id;
    `;
    const { rows } = await pool.query(sql);
    return rows;
}

async function getStatsStatus() {
    const sql = `
        SELECT status_id, COUNT(*)::int AS total
        FROM users
        GROUP BY status_id
        ORDER BY status_id;
    `;
    const { rows } = await pool.query(sql);
    return rows;
}

async function getStatsAge() {
    const sql = `
        SELECT
        CASE
            WHEN edad BETWEEN 18 AND 30 THEN '18-30'
            WHEN edad BETWEEN 31 AND 40 THEN '31-40'
            WHEN edad BETWEEN 41 AND 50 THEN '41-50'
            WHEN edad BETWEEN 51 AND 60 THEN '51-60'
            WHEN edad >= 61 THEN '60+'
            ELSE 'sin fecha'
        END as rango,
        COUNT(*)::INT AS total
        FROM (
            SELECT id, DATE_PART('year', AGE(fecha_nac))::int AS edad
            FROM users
            WHERE fecha_nac IS NOT NULL
        ) AS edades
        GROUP BY rango
        ORDER BY rango;
    `;
    const { rows } = await pool.query(sql);
    return rows;
}

// Reportes
async function getReportByRole(rol_id) {
    const { rows } = await pool.query(
        `SELECT id, nombre, apellido_pat, apellido_mat, email, status_id
        FROM users
        WHERE rol_id = $1`,
        [rol_id]
    );
    return rows;
}

async function getReportByStatus(status_id) {
    const { rows } = await pool.query(
        `SELECT u.id, u.nombre, u.apellido_pat, u.apellido_mat, u.email, u.num_tel,
            u.fecha_nac, r.nombre AS rol_nombre, s.estado AS estado
        FROM users u
        JOIN roles r ON r.id = u.rol_id
        JOIN status s ON s.id = u.status_id
        WHERE u.status_id = $1
        ORDER BY r.id, u.nombre
        `,
        [status_id]
    );
    return rows;
}

async function getReportAllRoles() {
    const { rows } = await pool.query(
        `SELECT u.id, u.nombre, u.apellido_pat, u.apellido_mat, u.email,
            r.nombre AS rol, s.estado AS estado
        FROM users u
        JOIN roles r ON r.id = u.rol_id
        JOIN status s ON s.id = u.status_id
        ORDER BY r.id, s.id, u.nombre
        `
    );
    return rows;
}

async function getReportGeneral() {
    const { rows } = await pool.query(
        `SELECT u.id, u.nombre, u.apellido_pat, u.apellido_mat, u.email, u.num_tel,
            u.fecha_nac, r.nombre AS rol_nombre, s.estado AS estado
        FROM users u
        JOIN roles r ON r.id = u.rol_id
        JOIN status s ON s.id = u.status_id
        ORDER BY r.id, s.id, u.nombre
        `
    );
    return rows;
}

export {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    updatePassword,
    deleteUser,
    getStatsRoles,
    getStatsStatus,
    getStatsAge,
    getReportByRole,
    getReportByStatus,
    getReportAllRoles,
    getReportGeneral,
    getUsers
};

