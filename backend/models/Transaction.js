const pool = require('../config/db');
const { calculateFine } = require('../utils/fineCalculator');

const Transaction = {
  // Issue a book
  issueBook: async (issueData) => {
    const { book_id, student_id, issued_by, issued_date, due_date } = issueData;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Double check book available copies
      const [bookRows] = await connection.query('SELECT available_copies FROM books WHERE id = ? FOR UPDATE', [book_id]);
      if (bookRows.length === 0) {
        throw new Error('Book not found');
      }
      
      const available = bookRows[0].available_copies;
      if (available <= 0) {
        throw new Error('No copies available for issue');
      }

      // 2. Insert issue record
      const [result] = await connection.query(
        `INSERT INTO issued_books (book_id, student_id, issued_by, issued_date, due_date, status) 
         VALUES (?, ?, ?, ?, ?, 'issued')`,
        [book_id, student_id, issued_by, issued_date, due_date]
      );

      // 3. Decrement available copies
      await connection.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', [book_id]);

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // Return a book
  returnBook: async (issueId, returnDate) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Fetch the issue transaction
      const [transactionRows] = await connection.query(
        'SELECT * FROM issued_books WHERE id = ? AND status != \'returned\' FOR UPDATE',
        [issueId]
      );
      if (transactionRows.length === 0) {
        throw new Error('Transaction not found or already returned');
      }

      const tx = transactionRows[0];
      const retDate = returnDate || new Date();

      // 2. Calculate fine
      const { daysOverdue, fineAmount } = calculateFine(tx.issued_date, tx.due_date, retDate);
      const finalStatus = daysOverdue > 0 ? 'overdue' : 'returned';

      // 3. Update issue record
      await connection.query(
        'UPDATE issued_books SET return_date = ?, status = ? WHERE id = ?',
        [retDate, 'returned', issueId]
      );

      // 4. Increment available copies
      await connection.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?', [tx.book_id]);

      // 5. If fine exists, log to fines table
      if (fineAmount > 0) {
        await connection.query(
          'INSERT INTO fines (issued_book_id, student_id, amount, days_overdue, paid) VALUES (?, ?, ?, ?, 0)',
          [tx.id, tx.student_id, fineAmount, daysOverdue]
        );
      }

      await connection.commit();
      return {
        success: true,
        daysOverdue,
        fineAmount
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // Fetch all issue logs with filters
  getAll: async (filters = {}) => {
    let query = `
      SELECT ib.*, 
             b.title as book_title, b.isbn as book_isbn,
             s.name as student_name, s.student_id as student_roll, s.department as student_dept,
             u.name as librarian_name
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      JOIN students s ON ib.student_id = s.id
      LEFT JOIN users u ON ib.issued_by = u.id
    `;
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push('ib.status = ?');
      params.push(filters.status);
    }
    if (filters.student_id) {
      conditions.push('ib.student_id = ?');
      params.push(filters.student_id);
    }
    if (filters.search) {
      conditions.push('(s.name LIKE ? OR s.student_id LIKE ? OR b.title LIKE ?)');
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY ib.issued_date DESC, ib.id DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Get overdue books
  getOverdue: async () => {
    const [rows] = await pool.query(`
      SELECT ib.*, 
             b.title as book_title, b.isbn as book_isbn,
             s.name as student_name, s.student_id as student_roll, s.phone as student_phone, s.email as student_email
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      JOIN students s ON ib.student_id = s.id
      WHERE ib.status = 'issued' AND ib.due_date < CURRENT_DATE()
      ORDER BY ib.due_date ASC
    `);
    return rows;
  },

  // Get reservation records
  getReservations: async () => {
    const [rows] = await pool.query(`
      SELECT r.*, 
             b.title as book_title, b.isbn as book_isbn, b.available_copies,
             s.name as student_name, s.student_id as student_roll
      FROM reservations r
      JOIN books b ON r.book_id = b.id
      JOIN students s ON r.student_id = s.id
      ORDER BY r.reserved_date DESC
    `);
    return rows;
  },

  createReservation: async (resData) => {
    const { book_id, student_id, reserved_date, expiry_date } = resData;
    const [result] = await pool.query(
      'INSERT INTO reservations (book_id, student_id, reserved_date, expiry_date, status) VALUES (?, ?, ?, ?, \'pending\')',
      [book_id, student_id, reserved_date, expiry_date]
    );
    return result.insertId;
  },

  updateReservationStatus: async (id, status) => {
    const [result] = await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  // Fine management
  getFines: async (filters = {}) => {
    let query = `
      SELECT f.*, 
             s.name as student_name, s.student_id as student_roll, s.department as student_dept,
             b.title as book_title
      FROM fines f
      JOIN students s ON f.student_id = s.id
      JOIN issued_books ib ON f.issued_book_id = ib.id
      JOIN books b ON ib.book_id = b.id
    `;
    const params = [];
    const conditions = [];

    if (filters.paid !== undefined) {
      conditions.push('f.paid = ?');
      params.push(filters.paid ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY f.created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  payFine: async (fineId) => {
    const [result] = await pool.query(
      'UPDATE fines SET paid = 1, paid_date = CURRENT_DATE() WHERE id = ?',
      [fineId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Transaction;
