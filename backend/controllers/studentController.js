const Student = require('../models/Student');
const User = require('../models/User');

const studentController = {
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.getAll();
      res.status(200).json(students);
    } catch (err) {
      console.error('Get all students error:', err);
      res.status(500).json({ message: 'Server error fetching students list.' });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }
      res.status(200).json(student);
    } catch (err) {
      console.error('Get student by ID error:', err);
      res.status(500).json({ message: 'Server error fetching student details.' });
    }
  },

  createStudent: async (req, res) => {
    try {
      const { student_id, name, email, phone, department, year, address } = req.body;

      if (!student_id || !name || !email || !department || !year) {
        return res.status(400).json({ message: 'Roll ID, Name, Email, Department and Year are required.' });
      }

      // Check duplicates
      const existingById = await Student.findByStudentId(student_id);
      if (existingById) {
        return res.status(400).json({ message: 'Student Roll ID is already registered.' });
      }

      // Handle photo if sent
      const photo = req.file ? `/uploads/students/${req.file.filename}` : null;

      const newId = await Student.create({
        student_id, name, email, phone, department, year, address, photo
      });

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'STUDENT_CREATE', `Added student: ${name} (${student_id})`, ip);

      res.status(201).json({
        message: 'Student added successfully.',
        id: newId
      });
    } catch (err) {
      console.error('Create student error:', err);
      res.status(500).json({ message: 'Server error adding student.' });
    }
  },

  updateStudent: async (req, res) => {
    try {
      const { student_id, name, email, phone, department, year, address, is_active } = req.body;
      const studentId = req.params.id;

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }

      // Check if student_id conflicts with another
      if (student_id && student_id !== student.student_id) {
        const existingById = await Student.findByStudentId(student_id);
        if (existingById) {
          return res.status(400).json({ message: 'Student Roll ID is already assigned to another student.' });
        }
      }

      const photo = req.file ? `/uploads/students/${req.file.filename}` : undefined;

      const updated = await Student.update(studentId, {
        student_id, name, email, phone, department, year, address, photo, is_active
      });

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'STUDENT_UPDATE', `Updated student Roll ID ${student_id || student.student_id}`, ip);

      res.status(200).json({ message: 'Student updated successfully.' });
    } catch (err) {
      console.error('Update student error:', err);
      res.status(500).json({ message: 'Server error updating student.' });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }

      await Student.delete(studentId);

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'STUDENT_DELETE', `Deleted student: ${student.name} (${student.student_id})`, ip);

      res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (err) {
      console.error('Delete student error:', err);
      res.status(500).json({ message: 'Server error deleting student.' });
    }
  },

  searchStudents: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search term is required.' });
      }
      const students = await Student.search(q);
      res.status(200).json(students);
    } catch (err) {
      console.error('Search students error:', err);
      res.status(500).json({ message: 'Server error searching students.' });
    }
  }
};

module.exports = studentController;
