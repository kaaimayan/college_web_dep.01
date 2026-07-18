const pool = require('../config/db');

const reportController = {
  booksReport: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT b.id, b.title, b.isbn, b.total_copies, b.available_copies, b.edition, b.year, b.shelf_location,
               c.name as category_name, a.name as author_name, p.name as publisher_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        LEFT JOIN authors a ON b.author_id = a.id
        LEFT JOIN publishers p ON b.publisher_id = p.id
        ORDER BY b.title ASC
      `);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Books report error:', err);
      res.status(500).json({ message: 'Error generating books dataset report.' });
    }
  },

  studentsReport: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT s.student_id, s.name, s.email, s.phone, s.department, s.year, s.is_active,
               (SELECT COUNT(*) FROM issued_books WHERE student_id = s.id AND status = 'issued') as active_loans,
               (SELECT SUM(amount) FROM fines WHERE student_id = s.id AND paid = 0) as unpaid_fines
        FROM students s
        ORDER BY s.name ASC
      `);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Students report error:', err);
      res.status(500).json({ message: 'Error generating students dataset report.' });
    }
  },

  finesReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let query = `
        SELECT f.*, s.name as student_name, s.student_id as student_roll,
               b.title as book_title
        FROM fines f
        JOIN students s ON f.student_id = s.id
        JOIN issued_books ib ON f.issued_book_id = ib.id
        JOIN books b ON ib.book_id = b.id
      `;
      const params = [];

      if (startDate && endDate) {
        query += ' WHERE DATE(f.created_at) BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      query += ' ORDER BY f.created_at DESC';

      const [rows] = await pool.query(query, params);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fines report error:', err);
      res.status(500).json({ message: 'Error generating fines dataset report.' });
    }
  },

  transactionsReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let query = `
        SELECT ib.*, b.title as book_title, s.name as student_name, s.student_id as student_roll,
               u.name as librarian_name
        FROM issued_books ib
        JOIN books b ON ib.book_id = b.id
        JOIN students s ON ib.student_id = s.id
        LEFT JOIN users u ON ib.issued_by = u.id
      `;
      const params = [];

      if (startDate && endDate) {
        query += ' WHERE DATE(ib.issued_date) BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      query += ' ORDER BY ib.issued_date DESC';

      const [rows] = await pool.query(query, params);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Transactions report error:', err);
      res.status(500).json({ message: 'Error generating transactions dataset report.' });
    }
  },

  getCategoryStats: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT c.name as name, COUNT(b.id) as value 
        FROM books b
        JOIN categories c ON b.category_id = c.id
        GROUP BY c.name
      `);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Category stats error:', err);
      res.status(500).json({ message: 'Error fetching category statistics.' });
    }
  },

  getMonthlyIssues: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT DATE_FORMAT(issued_date, '%M %Y') as month, COUNT(*) as count
        FROM issued_books
        WHERE issued_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(issued_date, '%M %Y'), YEAR(issued_date), MONTH(issued_date)
        ORDER BY YEAR(issued_date) ASC, MONTH(issued_date) ASC
      `);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Monthly issues stats error:', err);
      res.status(500).json({ message: 'Error fetching monthly issue statistics.' });
    }
  }
};

module.exports = reportController;
