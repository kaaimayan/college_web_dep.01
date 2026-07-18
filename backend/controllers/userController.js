const User = require('../models/User');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.status(200).json(users);
    } catch (err) {
      console.error('Get all users error:', err);
      res.status(500).json({ message: 'Server error fetching users list.' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error('Get user by ID error:', err);
      res.status(500).json({ message: 'Server error fetching user details.' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, email, role, is_active } = req.body;
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // If user avatar upload is supported, req.file.filename would be used
      const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

      const updated = await User.update(userId, { name, email, avatar });
      
      if (role || is_active !== undefined) {
        // Run quick direct DB update for role or is_active
        const pool = require('../config/db');
        let query = 'UPDATE users SET ';
        const params = [];
        const updates = [];
        if (role) {
          updates.push('role = ?');
          params.push(role);
        }
        if (is_active !== undefined) {
          updates.push('is_active = ?');
          params.push(is_active ? 1 : 0);
        }
        query += updates.join(', ') + ' WHERE id = ?';
        params.push(userId);
        await pool.query(query, params);
      }

      // Log update
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'USER_UPDATE', `Updated user ID ${userId} details`, ip);

      res.status(200).json({ message: 'User updated successfully.' });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ message: 'Server error updating user.' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      if (parseInt(userId) === req.user.id) {
        return res.status(400).json({ message: 'You cannot delete your own account.' });
      }

      const pool = require('../config/db');
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Log deletion
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'USER_DELETE', `Deleted user ID ${userId}`, ip);

      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ message: 'Server error deleting user.' });
    }
  }
};

module.exports = userController;
