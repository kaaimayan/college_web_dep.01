const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'library_for_college',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection & run self-healing schema migrations
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully as ID ' + connection.threadId);
    
    // Self-healing migration: add download_url if not exists
    try {
      await connection.query("ALTER TABLE books ADD COLUMN download_url VARCHAR(255) DEFAULT NULL");
      console.log('Database migration: Added download_url column to books table.');
    } catch (err) {
      // 1060 is "Duplicate column name", safe to ignore
      if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('Database migration failed for books.download_url:', err);
      }
    }

    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

module.exports = pool;
