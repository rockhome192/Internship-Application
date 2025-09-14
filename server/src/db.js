import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = await mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',          // ถ้า root มีรหัส ให้ใส่ตรงนี้
  database: 'expense_db',
  waitForConnections: true,
  connectionLimit: 10
});

export async function q(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return { rows };
}
