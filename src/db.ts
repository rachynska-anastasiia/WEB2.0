import { Pool } from 'pg';

export const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "127.0.0.1",
    port: 5432,
    database: "web2_db"
});

/*
export async function initTodo(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'CREATED'
        )
    `);
}*/