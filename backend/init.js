import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";

// Ensure 'process' is defined (for environments where it might be missing)
if (typeof process === "undefined") {
    global.process = { env: {} };
}

dotenv.config();

const { Client } = pg;

async function runInit() {
    const client = new Client({
        //process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    });
    try {
        await client.connect();

        //Check a la db
        const check = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
            );
        `);

        if (check.rows[0].exists) {
            console.log("La base de datos ya tiene tablas")
        } else {
            const sqlPath = path.join(process.cwd(), "init.sql");
            const sql = fs.readFileSync(sqlPath, "utf8");

            console.log("Ejecutando script init.sql ");
            console.log(sql);
            await client.query(sql);

            console.log("Tablas generadas, usuario registrado");
        }
        

    } catch (err) {
        console.error("Error durante la ejecución del script: ", err);
    } finally {
        await client.end();
    }
}


runInit();
