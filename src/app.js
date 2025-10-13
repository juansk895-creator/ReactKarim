import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

//Rutas
app.get("/api/test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS fecha_servidor");
        res.json({ ok: true, data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor comunicando en el puerto ${PORT}`));



