import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { getEnv } from '../config/env.js';

let db;

export function getDb() {
  if (db) return db;

  const dbPath = getEnv().dbPath;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}
