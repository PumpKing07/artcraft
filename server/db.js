import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Загружаем .env относительно файла, чтобы не зависеть от текущей директории запуска.
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
});

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не задан (проверь .env)");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Чтобы запросы к API не зависали бесконечно
  connectionTimeoutMillis: 5000,
});