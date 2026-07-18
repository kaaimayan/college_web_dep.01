import React from 'react';

const Loader = ({ message = 'Loading System Resources...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', gap: '20px' }}>
      <div className="spinner-border" role="status" style={{ width: '3.5rem', height: '3.5rem', color: 'var(--accent-gold)' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary fw-semibold fs-5 animate-pulse" style={{ letterSpacing: '1px' }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;
