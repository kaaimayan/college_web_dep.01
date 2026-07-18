import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange, placeholder = 'Search records...' }) => {
  return (
    <div className="position-relative w-100">
      <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control custom-input ps-5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
