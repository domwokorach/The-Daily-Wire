import pg from 'pg';
import { getEnv } from '../config/env.js';

const { Pool } = pg;

let pool;

export function getPool() {
  if (pool) return pool;
  pool = new Pool({ connectionString: getEnv().databaseUrl, max: 5 });
  return pool;
}

export async function query(text, params = []) {
  return getPool().query(text, params);
}
