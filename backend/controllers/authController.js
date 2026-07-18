const User = require('../models/User');
const { comparePassword, hashPassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/jwt');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      if (!user.is_active) {
        return res.status(403).json({ message: 'Your account has been deactivated.' });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = generateToken(user);
      
      // Log this login event
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(user.id, 'LOGIN', 'Logged into the system', ip);

      res.status(200).json({
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
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
      res.status(200).json(user);
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
