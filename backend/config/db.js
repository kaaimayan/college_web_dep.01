const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const port = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || 3306, 10);
const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
const password = process.env.DB_PASSWORD !== undefined 
  ? process.env.DB_PASSWORD 
  : (process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD : '');
const database = process.env.DB_NAME || process.env.MYSQLDATABASE || 'library_for_college';

const poolConfig = {
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

if (process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

// Test connection & run self-healing schema migrations
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Database connected successfully to ${host}:${port}/${database}`);
    
    // Self-healing migration: update role column for students
    try {
      await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'librarian', 'student') DEFAULT 'student'");
    } catch (err) {
      // Safe to ignore if already altered
    }

    // Self-healing migration: add download_url if not exists
    try {
      await connection.query("ALTER TABLE books ADD COLUMN download_url VARCHAR(255) DEFAULT NULL");
    } catch (err) {
      if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('Database migration note:', err.message);
      }
    }

    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

module.exports = pool;
