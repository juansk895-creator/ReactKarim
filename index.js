
//const express = require("express");
import express from 'express';
//const cors = require("cors");
import cors from 'cors';
//const { Pool } = require("pg");
import Pool from "pg";
//require("dotenv").config();
import dotenv from "dotenv";

dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

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


