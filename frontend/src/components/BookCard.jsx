import React from 'react';
import { FaBook } from 'react-icons/fa';

const BookCard = ({ book, onSelect }) => {
  return (
    <div className="glass-card h-100 d-flex flex-column justify-content-between p-3" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <div className="text-center mb-3">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="rounded-3 shadow-sm border border-secondary img-fluid"
            style={{ height: '180px', objectFit: 'cover', width: '130px' }}
          />
        ) : (
          <div 
            className="rounded-3 d-flex flex-column align-items-center justify-content-center mx-auto shadow-sm"
            style={{ 
              height: '180px', 
              width: '130px', 
              background: 'linear-gradient(135deg, var(--secondary-navy), var(--primary-navy))',
              border: '2px solid var(--accent-gold)'
            }}
          >
            <FaBook size={48} className="text-warning mb-2 animate-float" />
            <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '9px', letterSpacing: '1px' }}>
              No Cover
            </span>
          </div>
        )}
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

        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary">
          <span className="text-muted fs-9">Available</span>
          <span className={`badge ${book.available_copies > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill px-2.5 py-1`}>
            {book.available_copies} / {book.total_copies}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
