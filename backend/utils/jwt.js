const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'kr_arts_science_college_library_jwt_secret_2024',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'kr_arts_science_college_library_jwt_secret_2024');
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
