import React from 'react';

const Loader = ({ message = 'Loading System Resources...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', gap: '20px' }}>
      <div className="book-loader-container">
        <div className="book-loader">
          <div className="book-loader-cover-left"></div>
          <div className="book-loader-page"></div>
          <div className="book-loader-page"></div>
          <div className="book-loader-page"></div>
          <div className="book-loader-cover-right"></div>
        </div>
      </div>
      <p className="text-secondary fw-semibold fs-5 text-center mt-3" style={{ letterSpacing: '1.5px', fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)' }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;
