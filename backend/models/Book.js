const pool = require('../config/db');

const Book = {
  getAll: async (filters = {}) => {
    let query = `
      SELECT b.*, 
             c.name as category_name, 
             a.name as author_name, 
             p.name as publisher_name 
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN publishers p ON b.publisher_id = p.id
    `;
    const params = [];
    const conditions = [];

    if (filters.category_id) {
      conditions.push('b.category_id = ?');
      params.push(filters.category_id);
    }
    if (filters.search) {
      conditions.push('(b.title LIKE ? OR b.isbn LIKE ? OR a.name LIKE ?)');
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT b.*, 
             c.name as category_name, 
             a.name as author_name, 
             p.name as publisher_name 
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN publishers p ON b.publisher_id = p.id
      WHERE b.id = ?
    `, [id]);
    return rows[0];
  },

  findByIsbn: async (isbn) => {
    const [rows] = await pool.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
    return rows[0];
  },

  create: async (bookData) => {
    const {
      title, isbn, author_id, category_id, publisher_id,
      total_copies, available_copies, cover_image, download_url, description,
      edition, year, language, shelf_location
    } = bookData;

    const [result] = await pool.query(
      `INSERT INTO books (
        title, isbn, author_id, category_id, publisher_id,
        total_copies, available_copies, cover_image, download_url, description,
        edition, year, language, shelf_location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, isbn, author_id, category_id, publisher_id,
        total_copies, available_copies !== undefined ? available_copies : total_copies,
        cover_image || null, download_url || null, description, edition, year, language || 'English', shelf_location
      ]
    );
    return result.insertId;
  },

  update: async (id, bookData) => {
    const {
      title, isbn, author_id, category_id, publisher_id,
      total_copies, available_copies, cover_image, download_url, description,
      edition, year, language, shelf_location
    } = bookData;

    let query = `
      UPDATE books 
      SET title = ?, isbn = ?, author_id = ?, category_id = ?, publisher_id = ?,
          total_copies = ?, available_copies = ?, description = ?,
          edition = ?, year = ?, language = ?, shelf_location = ?, download_url = ?
    `;
    const params = [
      title, isbn, author_id, category_id, publisher_id,
      total_copies, available_copies, description,
      edition, year, language, shelf_location, download_url || null
    ];

    if (cover_image !== undefined) {
      query += ', cover_image = ?';
      params.push(cover_image);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Author, Category, Publisher helper search and insertions
  getOrCreateAuthor: async (name) => {
    if (!name) return null;
    const [rows] = await pool.query('SELECT id FROM authors WHERE name = ?', [name.trim()]);
    if (rows.length > 0) return rows[0].id;
    const [result] = await pool.query('INSERT INTO authors (name) VALUES (?)', [name.trim()]);
    return result.insertId;
  },

  getOrCreateCategory: async (name) => {
    if (!name) return null;
    const [rows] = await pool.query('SELECT id FROM categories WHERE name = ?', [name.trim()]);
    if (rows.length > 0) return rows[0].id;
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
    return result.insertId;
  },

  getOrCreatePublisher: async (name) => {
    if (!name) return null;
    const [rows] = await pool.query('SELECT id FROM publishers WHERE name = ?', [name.trim()]);
    if (rows.length > 0) return rows[0].id;
    const [result] = await pool.query('INSERT INTO publishers (name) VALUES (?)', [name.trim()]);
    return result.insertId;
  },

  getCategories: async () => {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  },

  getAuthors: async () => {
    const [rows] = await pool.query('SELECT * FROM authors ORDER BY name ASC');
    return rows;
  },

  getPublishers: async () => {
    const [rows] = await pool.query('SELECT * FROM publishers ORDER BY name ASC');
    return rows;
  }
};

module.exports = Book;
