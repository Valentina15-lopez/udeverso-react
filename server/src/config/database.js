// src/config/database.js
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    user: "udeverso_user",
    host: "localhost",
    database: "udeverso",
    password: "puerta2024",
    port: 5432,
});

export default pool;
