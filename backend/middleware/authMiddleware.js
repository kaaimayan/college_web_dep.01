const { verifyToken } = require('../utils/jwt');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Token is invalid or expired.' });
    }

    // Verify user exists and is active in database
    const [rows] = await pool.query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    const user = rows[0];
    if (!user.is_active) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    if (user.role === 'student') {
      const [studs] = await pool.query('SELECT id as db_student_id, student_id, department, year FROM students WHERE email = ?', [user.email]);
      if (studs.length > 0) {
        user.student_id = studs[0].student_id;
        user.db_student_id = studs[0].db_student_id;
        user.department = studs[0].department;
        user.year = studs[0].year;
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Authentication server error.' });
  }
};

module.exports = authMiddleware;
