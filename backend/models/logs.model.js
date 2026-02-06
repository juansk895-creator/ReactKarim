import { pool } from "../db.js";

export async function createLog(
    responsable_id,
    responsable_nombre,
    objetivo_id,
    objetivo_nombre,
    accion
) {
    const sql = `
        INSERT INTO bitacora_users (
            responsable_id,
            responsable_nombre,
            objetivo_id,
            objetivo_nombre,
            accion,
            fecha_accion
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;
    `;

    const values = [
        responsable_id,
        responsable_nombre,
        objetivo_id,
        objetivo_nombre,
        accion
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
}



