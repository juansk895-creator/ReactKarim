import express from 'express';
import cors from 'cors';
//import { Pool } from "pg";
import { pool } from './db.js';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import reportRoutes from './routes/reports.routes.js';

//dotenv.config(); // Revisar uso
dotenv.config({ path: "./.env" }); // Revisar uso

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Middlewares
app.use(
    cors({
        origin: "http://localhost:5173", // frontend
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

//Middleware base
app.use(express.json());

//Rutas api
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRouter);
app.use("/api/reports", reportRoutes);

//Test
app.get("/api/test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS fecha_servidor");
        res.json({ ok: true, data: result.rows[0] });
    } catch (err) {
        console.error("Error en /api/test:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

//Ruta incorrecta
app.use((req, res) => {
    res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});


//Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`Servidor comunicado con el puerto ${PORT}`)
);

/*
//Configuración de conexión a Postgres
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host:process.env.POSTGRES_HOST,
    port:process.env.POSTGRES_PORT,
    database:process.env.POSTGRES_DB
});

//Testeo de conexión
pool.connect()
    .then(() => console.log("Conectado a Postgres"))
    .catch(err => console.error("Error de conexión", err));

//Primeras rutas
app.get("/", (req, res) => {
    res.send("Servidor Express funcionando");
});

//Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
*/

