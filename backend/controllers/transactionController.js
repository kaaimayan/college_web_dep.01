const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Student = require('../models/Student');
const User = require('../models/User');
const pool = require('../config/db');

const transactionController = {
  issueBook: async (req, res) => {
    try {
      const { book_id, student_id, issued_date, due_date } = req.body;

      if (!book_id || !student_id || !issued_date || !due_date) {
        return res.status(400).json({ message: 'Book ID, Student ID, Issued Date, and Due Date are required.' });
      }

      // Check student activity
      const student = await Student.findById(student_id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }
      if (!student.is_active) {
        return res.status(403).json({ message: 'Student account is inactive.' });
      }

      // Perform DB transaction to issue book
      const txId = await Transaction.issueBook({
        book_id,
        student_id,
        issued_by: req.user.id,
        issued_date,
        due_date
      });

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'BOOK_ISSUE', `Issued book ID ${book_id} to student ${student.name} (${student.student_id})`, ip);

      res.status(201).json({
        message: 'Book issued successfully.',
        transactionId: txId
      });
    } catch (err) {
      console.error('Issue book error:', err);
      res.status(500).json({ message: err.message || 'Server error issuing book.' });
    }
  },

  returnBook: async (req, res) => {
    try {
      const { transaction_id, return_date } = req.body;

      if (!transaction_id) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
      }

      const result = await Transaction.returnBook(transaction_id, return_date);

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'BOOK_RETURN', `Returned book in transaction ID ${transaction_id}. Overdue days: ${result.daysOverdue}. Fine: ${result.fineAmount}`, ip);

      res.status(200).json({
        message: 'Book returned successfully.',
        ...result
      });
    } catch (err) {
      console.error('Return book error:', err);
      res.status(500).json({ message: err.message || 'Server error returning book.' });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const { status, student_id, search } = req.query;
      const transactions = await Transaction.getAll({ status, student_id, search });
      res.status(200).json(transactions);
    } catch (err) {
      console.error('Get all transactions error:', err);
      res.status(500).json({ message: 'Server error fetching transactions list.' });
    }
  },

  getOverdueBooks: async (req, res) => {
    try {
      const overdue = await Transaction.getOverdue();
      res.status(200).json(overdue);
    } catch (err) {
      console.error('Get overdue error:', err);
      res.status(500).json({ message: 'Server error fetching overdue records.' });
    }
  },

  getReservations: async (req, res) => {
    try {
      const reservations = await Transaction.getReservations();
      res.status(200).json(reservations);
    } catch (err) {
      console.error('Get reservations error:', err);
      res.status(500).json({ message: 'Server error fetching reservations.' });
    }
  },

  createReservation: async (req, res) => {
    try {
      const { book_id, student_id, reserved_date, expiry_date } = req.body;
      if (!book_id || !student_id || !reserved_date || !expiry_date) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const resId = await Transaction.createReservation({ book_id, student_id, reserved_date, expiry_date });
      res.status(201).json({ message: 'Reservation created successfully.', id: resId });
    } catch (err) {
      console.error('Create reservation error:', err);
      res.status(500).json({ message: 'Server error creating reservation.' });
    }
  },

  updateReservationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
      }

      await Transaction.updateReservationStatus(id, status);
      res.status(200).json({ message: 'Reservation status updated.' });
    } catch (err) {
      console.error('Update reservation error:', err);
      res.status(500).json({ message: 'Server error updating reservation.' });
    }
  },

  getFines: async (req, res) => {
    try {
      const { paid } = req.query;
      const filter = {};
      if (paid !== undefined) filter.paid = paid === 'true';

      const fines = await Transaction.getFines(filter);
      res.status(200).json(fines);
    } catch (err) {
      console.error('Get fines error:', err);
      res.status(500).json({ message: 'Server error fetching fines.' });
    }
  },

  payFine: async (req, res) => {
    try {
      const { id } = req.params;
      await Transaction.payFine(id);
      
      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'FINE_PAY', `Marked Fine ID ${id} as paid`, ip);

      res.status(200).json({ message: 'Fine payment logged successfully.' });
    } catch (err) {
      console.error('Pay fine error:', err);
      res.status(500).json({ message: 'Server error saving fine payment.' });
    }
  },

  getDashboardStats: async (req, res) => {
    try {
      // 1. Core counters
      const [[booksCount]] = await pool.query('SELECT SUM(total_copies) as total, SUM(available_copies) as available FROM books');
      const [[issuedCount]] = await pool.query('SELECT COUNT(*) as count FROM issued_books WHERE status = \'issued\'');
      const [[studentsCount]] = await pool.query('SELECT COUNT(*) as count FROM students');
      const [[overdueCount]] = await pool.query('SELECT COUNT(*) as count FROM issued_books WHERE status = \'issued\' AND due_date < CURRENT_DATE()');
      const [[fineCollected]] = await pool.query('SELECT SUM(amount) as total FROM fines WHERE paid = 1');

      // 2. Today's Issue and Returns
      const [[todayIssues]] = await pool.query('SELECT COUNT(*) as count FROM issued_books WHERE DATE(issued_date) = CURRENT_DATE()');
      const [[todayReturns]] = await pool.query('SELECT COUNT(*) as count FROM issued_books WHERE DATE(return_date) = CURRENT_DATE()');

      // 3. Category distribution (for Charts)
      const [categoryDistribution] = await pool.query(`
        SELECT c.name as category, COUNT(b.id) as count 
        FROM books b
        JOIN categories c ON b.category_id = c.id
        GROUP BY c.name
      `);

      // 4. Department distribution (for Charts)
      const [deptDistribution] = await pool.query(`
        SELECT department, COUNT(*) as count 
        FROM students 
        GROUP BY department
      `);

      // 5. Recent activity logs
      const recentActivities = await User.getActivityLogs(8);

      res.status(200).json({
        totalBooks: booksCount.total || 0,
        availableBooks: booksCount.available || 0,
        issuedBooks: issuedCount.count || 0,
        totalStudents: studentsCount.count || 0,
        overdueBooks: overdueCount.count || 0,
        fineCollected: fineCollected.total || 0,
        todayIssues: todayIssues.count || 0,
        todayReturns: todayReturns.count || 0,
        categoryDistribution,
        deptDistribution,
        recentActivities
      });
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      res.status(500).json({ message: 'Server error generating dashboard details.' });
    }
  }
};

module.exports = transactionController;
