const pool = require('../config/db');

const Student = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  },

  findByStudentId: async (studentId) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
    return rows[0];
  },

  create: async (studentData) => {
    const { student_id, name, email, phone, department, year, address, photo } = studentData;
    const [result] = await pool.query(
      `INSERT INTO students (student_id, name, email, phone, department, year, address, photo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, name, email, phone, department, year, address, photo || null]
    );
    return result.insertId;
  },

  update: async (id, studentData) => {
    const { student_id, name, email, phone, department, year, address, photo, is_active } = studentData;
    let query = `
      UPDATE students 
      SET student_id = ?, name = ?, email = ?, phone = ?, department = ?, year = ?, address = ?
    `;
    const params = [student_id, name, email, phone, department, year, address];

    if (photo !== undefined) {
      query += ', photo = ?';
      params.push(photo);
    }
    
    if (is_active !== undefined) {
      query += ', is_active = ?';
      params.push(is_active);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  search: async (queryStr) => {
    const term = `%${queryStr}%`;
    const [rows] = await pool.query(
      `SELECT * FROM students 
       WHERE student_id LIKE ? OR name LIKE ? OR email LIKE ? OR department LIKE ? 
       ORDER BY name ASC`,
      [term, term, term, term]
    );
    return rows;
  }
};

module.exports = Student;
