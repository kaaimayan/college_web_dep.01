import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../services/books';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author_name: '',
    category_name: '',
    publisher_name: '',
    total_copies: 1,
    edition: '',
    year: '',
    language: 'English',
    shelf_location: '',
    download_url: '',
    description: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });
    if (coverFile) {
      submissionData.append('cover_image', coverFile);
    }

    try {
      await createBook(submissionData);
      navigate('/books');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error inserting book. Please ensure ISBN is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header bar */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-gold p-2 rounded-circle d-flex align-items-center justify-content-center" onClick={() => navigate('/books')}>
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h4 className="fw-bold text-white mb-1">Add New Book</h4>
          <p className="text-secondary mb-0 fs-7">Register a new title into the library repository.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0">{error}</div>}

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Title, ISBN, Author */}
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">BOOK TITLE *</label>
                <input type="text" name="title" className="form-control custom-input" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">ISBN NUMBER *</label>
                <input type="text" name="isbn" className="form-control custom-input" placeholder="e.g. 9780132350884" value={formData.isbn} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">AUTHOR NAME *</label>
                <input type="text" name="author_name" className="form-control custom-input" placeholder="e.g. Robert C. Martin" value={formData.author_name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">CATEGORY *</label>
                <input type="text" name="category_name" className="form-control custom-input" placeholder="e.g. Computer Science" value={formData.category_name} onChange={handleChange} required />
              </div>
            </div>

            {/* Publisher, copies, and file upload */}
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">PUBLISHER NAME</label>
                <input type="text" name="publisher_name" className="form-control custom-input" placeholder="e.g. O'Reilly Media" value={formData.publisher_name} onChange={handleChange} />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">TOTAL COPIES *</label>
                    <input type="number" name="total_copies" min="1" className="form-control custom-input" value={formData.total_copies} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">EDITION</label>
                    <input type="text" name="edition" className="form-control custom-input" placeholder="e.g. 2nd Edition" value={formData.edition} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">YEAR</label>
                    <input type="number" name="year" className="form-control custom-input" placeholder="2024" value={formData.year} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">SHELF LOCATION</label>
                    <input type="text" name="shelf_location" className="form-control custom-input" placeholder="e.g. CS-SHELF-03" value={formData.shelf_location} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Cover Image upload previews */}
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">BOOK COVER PHOTO</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <input type="file" id="coverUpload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="coverUpload" className="btn btn-outline-gold d-flex align-items-center gap-2 py-2">
                      <FaUpload /> Choose Cover
                    </label>
                  </div>
                  {coverPreview && (
                    <img src={coverPreview} alt="preview" className="rounded-3 border border-secondary" style={{ width: '50px', height: '65px', objectFit: 'cover' }} />
                  )}
                </div>
              </div>

              {/* Online Book URL */}
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">DOWNLOAD LINK (FOR ONLINE BOOKS / E-BOOKS)</label>
                <input type="url" name="download_url" className="form-control custom-input" placeholder="e.g. https://example.com/book.pdf" value={formData.download_url} onChange={handleChange} />
              </div>
            </div>

            {/* Description note */}
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">DESCRIPTION & SYNOPSIS</label>
                <textarea name="description" className="form-control custom-input" rows="4" placeholder="Brief summary of book syllabus or reference guidelines..." value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>

            {/* Actions panel */}
            <div className="col-12 d-flex justify-content-end gap-3 mt-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/books')}>Cancel</button>
              <button type="submit" className="btn btn-gold" disabled={loading}>
                {loading ? 'SAVING...' : 'SAVE RECORD'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
