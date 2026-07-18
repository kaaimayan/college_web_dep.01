const Book = require('../models/Book');
const User = require('../models/User');

const bookController = {
  getAllBooks: async (req, res) => {
    try {
      const { category_id, search } = req.query;
      const books = await Book.getAll({ category_id, search });
      res.status(200).json(books);
    } catch (err) {
      console.error('Get all books error:', err);
      res.status(500).json({ message: 'Server error fetching books list.' });
    }
  },

  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
      }
      res.status(200).json(book);
    } catch (err) {
      console.error('Get book by ID error:', err);
      res.status(500).json({ message: 'Server error fetching book details.' });
    }
  },

  createBook: async (req, res) => {
    try {
      const {
        title, isbn, author_name, category_name, publisher_name,
        total_copies, description, edition, year, language, shelf_location
      } = req.body;

      if (!title || !isbn || !total_copies) {
        return res.status(400).json({ message: 'Title, ISBN, and Total Copies are required.' });
      }

      // Check duplicates
      const existing = await Book.findByIsbn(isbn);
      if (existing) {
        return res.status(400).json({ message: 'Book with this ISBN is already registered.' });
      }

      // Resolve relational ids by auto-creating categories/authors/publishers if new names are supplied
      const author_id = await Book.getOrCreateAuthor(author_name);
      const category_id = await Book.getOrCreateCategory(category_name);
      const publisher_id = await Book.getOrCreatePublisher(publisher_name);

      const cover_image = req.file ? `/uploads/books/${req.file.filename}` : null;

      const newId = await Book.create({
        title, isbn, author_id, category_id, publisher_id,
        total_copies: parseInt(total_copies),
        available_copies: parseInt(total_copies),
        cover_image, description, edition, year: year ? parseInt(year) : null,
        language, shelf_location
      });

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'BOOK_CREATE', `Added book: ${title} (ISBN: ${isbn})`, ip);

      res.status(201).json({
        message: 'Book created successfully.',
        id: newId
      });
    } catch (err) {
      console.error('Create book error:', err);
      res.status(500).json({ message: 'Server error creating book record.' });
    }
  },

  updateBook: async (req, res) => {
    try {
      const {
        title, isbn, author_name, category_name, publisher_name,
        total_copies, available_copies, description, edition, year, language, shelf_location
      } = req.body;
      const bookId = req.params.id;

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
      }

      if (isbn && isbn !== book.isbn) {
        const existing = await Book.findByIsbn(isbn);
        if (existing) {
          return res.status(400).json({ message: 'Book with this ISBN already exists.' });
        }
      }

      // Resolve IDs
      const author_id = author_name ? await Book.getOrCreateAuthor(author_name) : book.author_id;
      const category_id = category_name ? await Book.getOrCreateCategory(category_name) : book.category_id;
      const publisher_id = publisher_name ? await Book.getOrCreatePublisher(publisher_name) : book.publisher_id;

      const cover_image = req.file ? `/uploads/books/${req.file.filename}` : undefined;

      // Adjust available copies based on total_copies difference if not explicitly sent
      let finalAvailable = available_copies !== undefined ? parseInt(available_copies) : book.available_copies;
      if (total_copies !== undefined) {
        const diff = parseInt(total_copies) - book.total_copies;
        if (available_copies === undefined) {
          finalAvailable = book.available_copies + diff;
        }
      }

      await Book.update(bookId, {
        title, isbn, author_id, category_id, publisher_id,
        total_copies: total_copies !== undefined ? parseInt(total_copies) : book.total_copies,
        available_copies: finalAvailable,
        cover_image, description, edition, year: year ? parseInt(year) : book.year,
        language, shelf_location
      });

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'BOOK_UPDATE', `Updated book: ${title || book.title}`, ip);

      res.status(200).json({ message: 'Book updated successfully.' });
    } catch (err) {
      console.error('Update book error:', err);
      res.status(500).json({ message: 'Server error updating book.' });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
      }

      await Book.delete(bookId);

      // Log action
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await User.logActivity(req.user.id, 'BOOK_DELETE', `Deleted book: ${book.title} (ISBN: ${book.isbn})`, ip);

      res.status(200).json({ message: 'Book deleted successfully.' });
    } catch (err) {
      console.error('Delete book error:', err);
      res.status(500).json({ message: 'Server error deleting book.' });
    }
  },

  searchBooks: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query is required.' });
      }
      const books = await Book.getAll({ search: q });
      res.status(200).json(books);
    } catch (err) {
      console.error('Search books error:', err);
      res.status(500).json({ message: 'Server error searching books.' });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Book.getCategories();
      res.status(200).json(categories);
    } catch (err) {
      console.error('Get categories error:', err);
      res.status(500).json({ message: 'Server error fetching categories.' });
    }
  },

  getAuthors: async (req, res) => {
    try {
      const authors = await Book.getAuthors();
      res.status(200).json(authors);
    } catch (err) {
      console.error('Get authors error:', err);
      res.status(500).json({ message: 'Server error fetching authors.' });
    }
  },

  getPublishers: async (req, res) => {
    try {
      const publishers = await Book.getPublishers();
      res.status(200).json(publishers);
    } catch (err) {
      console.error('Get publishers error:', err);
      res.status(500).json({ message: 'Server error fetching publishers.' });
    }
  }
};

module.exports = bookController;
