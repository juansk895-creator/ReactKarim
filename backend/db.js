import dotenv from 'dotenv';

dotenv.config();

import pg from 'pg';

const { Pool } = pg;


export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

console.log('Datos:', typeof process.env.POSTGRES_USER);
console.log('Password detectado:', typeof process.env.POSTGRES_PASSWORD, process.env.POSTGRES_PASSWORD ? ' definida ' : ' indefinida ');
