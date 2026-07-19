import React from 'react';
import { FaBook, FaBookReader, FaHandHolding } from 'react-icons/fa';

const BookCard = ({ book, onSelect, isStudent, onBorrow }) => {
  return (
    <div className="glass-card h-100 d-flex flex-column justify-content-between p-3" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div className="book-3d-wrapper mb-3">
        <div className="book-3d">
          <div className="book-cover-front">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="book-cover-img"
              />
            ) : (
              <div className="book-cover-placeholder">
                <FaBook size={36} className="text-warning mb-1" />
                <span className="no-cover-text">NO COVER</span>
              </div>
            )}
            <div className="book-spine"></div>
          </div>
          <div className="book-pages">
            <div className="book-page"></div>
            <div className="book-page"></div>
            <div className="book-page"></div>
          </div>
          <div className="book-cover-back"></div>
        </div>
      </div>

      <div className="d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <h6 className="text-white fw-bold mb-1 line-clamp-2" style={{ minHeight: '38px', fontSize: '14px' }}>
            {book.title}
          </h6>
          <p className="text-secondary mb-2 fs-8 text-truncate">
            By {book.author_name || 'Unknown Author'}
          </p>
        </div>

        <div className="d-flex flex-column gap-2 mt-2 pt-2 border-top border-secondary">
          <div className="d-flex justify-content-between align-items-center">
            {book.download_url ? (
              <span className="badge bg-primary-subtle text-primary rounded-pill px-2.5 py-1 fs-9">
                Digital E-Book
              </span>
            ) : (
              <>
                <span className="text-muted fs-9">Available Copies</span>
                <span className={`badge ${book.available_copies > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill px-2.5 py-1`}>
                  {book.available_copies} / {book.total_copies}
                </span>
              </>
            )}
          </div>

          {/* Read / Borrow Actions for Students */}
          {isStudent ? (
            <div className="d-flex gap-1.5 mt-1">
              {book.download_url ? (
                <a 
                  href={book.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-gold btn-xs flex-fill py-1 fs-8 d-flex align-items-center justify-content-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaBookReader size={12} /> Read Online
                </a>
              ) : (
                <button 
                  type="button"
                  className={`btn btn-xs flex-fill py-1 fs-8 d-flex align-items-center justify-content-center gap-1 ${
                    book.available_copies > 0 ? 'btn-gold' : 'btn-outline-secondary disabled'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (book.available_copies > 0 && onBorrow) onBorrow(book);
                  }}
                  disabled={book.available_copies <= 0}
                >
                  <FaHandHolding size={12} /> {book.available_copies > 0 ? 'Borrow Book' : 'Unavailable'}
                </button>
              )}
            </div>
          ) : (
            book.download_url && (
              <a 
                href={book.download_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-xs btn-gold py-1 fs-8 d-flex align-items-center justify-content-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <FaBookReader size={12} /> Download / View PDF
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
