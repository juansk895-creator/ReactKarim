import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from './db.js'; //"./src/db.js";
//rutas
//import authRoutes from './src/routes/auth.routes.js';
import authRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

//Archivo estático
app.use(express.static(path.join(__dirname, "public")));

//app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);

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



