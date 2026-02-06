import { pool } from "../db.js";

const ALLOWED_SORT = {
    created_at: "fecha_accion",
    responsable_nombre: "responsable_nombre",
    objetivo_nombre: "objetivo_nombre",
    accion: "accion"
};

export async function listLogs(req, res) {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 10, 1), 100);

    const sortBySql = ALLOWED_SORT[req.query.sortBy] || "fecha_accion";
    const sortDir = (req.query.sortDir || "").toLowerCase() === "asc" ? "ASC" : "DESC";

    const offset = (page -1) * perPage;

    const params = [];
    let where = "WHERE 1=1";

    if (req.query.q) {
        params.push(`%${req.query.q}%`);
        where += `
            AND (
                responsable_nombre ILIKE $${params.length}
                OR objetivo_nombre ILIKE $${params.length}
                OR accion ILIKE $${params.length}
            )
        `;
    }

    const fromSql = `
        FROM bitacora_users
        ${where}
    `;

    const countSql = `SELECT COUNT(*)::int AS count ${fromSql}`;

    const dataSql = `
        SELECT
            id, responsable_id, responsable_nombre, objetivo_id, objetivo_nombre,
            accion AS description, fecha_accion AS created_at
        ${fromSql}
        ORDER BY ${sortBySql} ${sortDir}
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
    `;

    const client = await pool.connect();

    try {
        
        const countRes = await client.query(countSql, params);
        const total = countRes.rows[0].count;

        const dataParams = params.concat([perPage, offset]);
        const dataRes = await client.query(dataSql, dataParams);

        res.json({
            ok: true,
            logs: dataRes.rows,
            page,
            perPage,
            total,
            totalPages: Math.max(1, Math.ceil(total / perPage))
        });
    } catch (err) {
        console.error("Error listLogs (backend):", err);
        res.status(500).json({ ok:false, error: "Error interno (backend)" });
    } finally {
        client.release();
    }
}

