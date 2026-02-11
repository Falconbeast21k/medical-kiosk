import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export async function initializeDatabase() {
  if (db) return db;

  db = await open({
    filename: path.join(__dirname, '../../database/medical_kiosk.db'),
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');
  return db;
}

export async function getDatabase() {
  if (!db) {
    await initializeDatabase();
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
