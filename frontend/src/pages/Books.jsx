import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook, getCategories } from '../services/books';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import Modal from '../components/Modal';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchBooks = async () => {
    try {
      const filters = {};
      if (search) filters.search = search;
      if (selectedCategory) filters.category_id = selectedCategory;

      const data = await getBooks(filters);
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, selectedCategory]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    try {
      await deleteBook(bookToDelete.id);
      setBooks(books.filter(b => b.id !== bookToDelete.id));
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Error deleting book. It might be referenced in active transactions.');
    }
  };

  const openDeleteModal = (e, book) => {
    e.stopPropagation();
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const openViewModal = (book) => {
    setSelectedBook(book);
    setShowViewModal(true);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-white mb-1">Book Catalog</h4>
          <p className="text-secondary mb-0 fs-7">Manage and browse the college collection here.</p>
        </div>
        <Link to="/books/add" className="btn btn-gold d-flex align-items-center gap-2">
          <FaPlus /> Add New Book
        </Link>
      </div>

      {/* Filter and Search actions bar */}
      <div className="glass-card p-3">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <SearchBar value={search} onChange={setSearch} placeholder="Search books by title, ISBN, or author..." />
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select custom-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid Layout */}
      {loading ? (
        <Loader message="Loading catalog inventory..." />
      ) : (
        <div className="row g-4">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                {/* Book Card wrapper to handle custom action display overlay on hover */}
                <div className="position-relative h-100 style-card-hover">
                  <BookCard book={book} onSelect={() => openViewModal(book)} />
                  <div 
                    className="position-absolute d-flex gap-2"
                    style={{ top: '15px', right: '15px', zIndex: 5 }}
                  >
                    <Link to={`/books/edit/${book.id}`} className="btn btn-dark btn-sm rounded-circle p-2 text-warning shadow" title="Edit details" onClick={(e) => e.stopPropagation()}>
                      <FaEdit />
                    </Link>
                    <button className="btn btn-dark btn-sm rounded-circle p-2 text-danger shadow" title="Delete record" onClick={(e) => openDeleteModal(e, book)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-secondary py-5">
              No books found matching search filters.
            </div>
          )}
        </div>
      )}

      {/* View Book Details Modal */}
      {selectedBook && (
        <Modal 
          show={showViewModal} 
          onHide={() => setShowViewModal(false)}
          title={selectedBook.title}
        >
          <div className="row g-3">
            <div className="col-12 col-md-4 text-center">
              {selectedBook.cover_image ? (
                <img src={selectedBook.cover_image} alt={selectedBook.title} className="rounded-3 img-fluid border border-secondary" style={{ maxHeight: '200px', objectFit: 'cover' }} />
              ) : (
                <div className="rounded-3 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 mx-auto" style={{ width: '130px', height: '180px', border: '1px dashed var(--accent-gold)' }}>
                  No Cover
                </div>
              )}
            </div>
            <div className="col-12 col-md-8 fs-7">
              <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p><strong>Author:</strong> {selectedBook.author_name || 'N/A'}</p>
              <p><strong>Category:</strong> {selectedBook.category_name || 'N/A'}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisher_name || 'N/A'}</p>
              <p><strong>Edition / Year:</strong> {selectedBook.edition || '1st'} / {selectedBook.year || 'N/A'}</p>
              <p><strong>Shelf Location:</strong> <span className="badge bg-secondary">{selectedBook.shelf_location || 'N/A'}</span></p>
              <p><strong>Status:</strong> <span className={`badge ${selectedBook.available_copies > 0 ? 'bg-success' : 'bg-danger'}`}>{selectedBook.available_copies > 0 ? 'Available' : 'Issued Out'}</span></p>
              <p><strong>Inventory:</strong> {selectedBook.available_copies} Available of {selectedBook.total_copies} total copies</p>
            </div>
            <div className="col-12 border-top border-secondary pt-3 mt-3">
              <h6 className="text-warning">Description / Notes</h6>
              <p className="text-secondary fs-7 mb-0">{selectedBook.description || 'No description notes provided.'}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        footerActions={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteConfirm}>Delete Book</button>
          </>
        }
      >
        <p className="fs-7 mb-0">Are you sure you want to delete <strong>{bookToDelete?.title}</strong>? This action is permanent and cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Books;
