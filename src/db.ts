import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const getEnvNum = (key: string, defaultValue: number, min: number = 0): number => {
    const val = Number(process.env[key]);
    return Number.isFinite(val) && val >= min ? Math.floor(val) : defaultValue;
  };
  
  const poolMax = getEnvNum('PG_POOL_MAX', 5, 1);
  const connectionTimeoutMillis = getEnvNum('PG_POOL_CONN_TIMEOUT_MS', 5000);
  const idleTimeoutMillis = getEnvNum('PG_POOL_IDLE_TIMEOUT_MS', 30000);

export const pool = connectionString
    ? new Pool({
        connectionString,
        max: poolMax,
        connectionTimeoutMillis,
        idleTimeoutMillis
    })
    : new Pool({
        user: "postgres",
        password: "postgres",
        host: "127.0.0.1",
        port: 5432,
        database: "web2_db",
        max: poolMax,
        connectionTimeoutMillis,
        idleTimeoutMillis
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