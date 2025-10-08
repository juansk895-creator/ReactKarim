const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Configuración de conexión a Postgres
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
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


