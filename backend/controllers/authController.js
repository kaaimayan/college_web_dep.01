const User = require('../models/User');
const pool = require('../config/db');
const { comparePassword, hashPassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const inputStr = email.trim();
      const passStr = password.trim();

      // 1. Look for user in users table by email
      let user = await User.findByEmail(inputStr);

      if (!user) {
        // Search students table by email or student_id if not found directly in users
        const [studentRows] = await pool.query(
          'SELECT * FROM students WHERE LOWER(email) = LOWER(?) OR LOWER(student_id) = LOWER(?)',
          [inputStr, inputStr]
        );

        if (studentRows.length > 0) {
          const student = studentRows[0];
          user = await User.findByEmail(student.email);

          // If user record does not exist for this student yet, auto-create it with passStr or student123
          if (!user) {
            const hashedPass = await hashPassword(passStr);
            const newUserId = await User.create({
              name: student.name,
              email: student.email,
              password: hashedPass,
              role: 'student'
            });
            user = await User.findById(newUserId);
          }
        }
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials. User or Student account not found.' });
      }

      if (!user.is_active) {
        return res.status(403).json({ message: 'Your account has been deactivated.' });
      }

      // 2. Compare password
      let isMatch = await comparePassword(passStr, user.password);

      // Fallback check for student roll ID or default password if direct hash didn't match
      if (!isMatch && user.role === 'student') {
        const [studRows] = await pool.query(
          'SELECT student_id FROM students WHERE LOWER(email) = LOWER(?)',
          [user.email]
        );
        if (studRows.length > 0) {
          const rollId = studRows[0].student_id;
          if (passStr.toLowerCase() === rollId.toLowerCase()) {
            isMatch = true;
          }
        }
        if (!isMatch) {
          const isDefaultMatch = await comparePassword('student123', user.password);
          if (isDefaultMatch) {
            isMatch = true;
          }
        }
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
      }

      // 3. Attach student profile details if student
      let studentDetails = null;
      if (user.role === 'student') {
        const [studs] = await pool.query(
          'SELECT id as db_student_id, student_id, department, year, photo FROM students WHERE email = ?',
          [user.email]
        );
        if (studs.length > 0) {
          studentDetails = studs[0];
        }
      }

      const token = generateToken(user);
      
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(user.id, 'LOGIN', `Logged into system (${user.role})`, ip);

      res.status(200).json({
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || studentDetails?.photo,
          student_id: studentDetails?.student_id || null,
          db_student_id: studentDetails?.db_student_id || null,
          department: studentDetails?.department || null,
          year: studentDetails?.year || null
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login.' });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }

      const hashedPassword = await hashPassword(password);
      
      const newUserId = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'librarian'
      });

      // Log registration
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (req.user) {
        await User.logActivity(req.user.id, 'USER_REGISTER', `Registered new user: ${name} (${role || 'librarian'})`, ip);
      }

      res.status(201).json({
        message: 'User registered successfully.',
        userId: newUserId
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      let responseUser = { ...user };
      if (user.role === 'student') {
        const [studs] = await pool.query(
          'SELECT id as db_student_id, student_id, department, year, phone, address, photo FROM students WHERE email = ?',
          [user.email]
        );
        if (studs.length > 0) {
          responseUser = { ...responseUser, ...studs[0] };
        }
      }

      res.status(200).json(responseUser);
    } catch (err) {
      console.error('Profile fetch error:', err);
      res.status(500).json({ message: 'Server error fetching profile.' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required.' });
      }

      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password.' });
      }

      const hashedNew = await hashPassword(newPassword);
      await User.updatePassword(req.user.id, hashedNew);

      // Log change password
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'CHANGE_PASSWORD', 'Updated password', ip);

      res.status(200).json({ message: 'Password changed successfully.' });
    } catch (err) {
      console.error('Change password error:', err);
      res.status(500).json({ message: 'Server error changing password.' });
    }
  }
};

module.exports = authController;
