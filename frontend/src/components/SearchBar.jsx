import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange, placeholder = 'Search records...' }) => {
  return (
    <div className="position-relative w-100 search-bar-container">
      <span 
        className="position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center"
        style={{
          left: '16px',
          zIndex: 10,
          pointerEvents: 'none',
          fontSize: '15px',
          color: '#2563eb'
        }}
      >
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control custom-input search-bar-input"
        style={{ paddingLeft: '50px !important' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
