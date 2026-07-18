const pool = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT id, name, email, role, avatar, is_active, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (userData) => {
    const { name, email, password, role } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'librarian']
    );
    return result.insertId;
  },

  update: async (id, userData) => {
    const { name, email, avatar } = userData;
    let query = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email];
    
    if (avatar !== undefined) {
      query += ', avatar = ?';
      params.push(avatar);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },

  updatePassword: async (id, hashedPassword) => {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  },

  getAll: async () => {
    const [rows] = await pool.query('SELECT id, name, email, role, avatar, is_active, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },

  logActivity: async (userId, action, details, ipAddress) => {
    try {
      await pool.query(
        'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
        [userId, action, details, ipAddress || '127.0.0.1']
      );
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  },

  getActivityLogs: async (limit = 10) => {
    const [rows] = await pool.query(`
      SELECT a.*, u.name as user_name, u.role as user_role 
      FROM activity_logs a 
      LEFT JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT ?
    `, [limit]);
    return rows;
  }
};

module.exports = User;
