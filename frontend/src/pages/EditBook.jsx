import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBook, updateBook } from '../services/books';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author_name: '',
    category_name: '',
    publisher_name: '',
    total_copies: 1,
    available_copies: 1,
    edition: '',
    year: '',
    language: 'English',
    shelf_location: '',
    download_url: '',
    description: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const book = await getBook(id);
        setFormData({
          title: book.title || '',
          isbn: book.isbn || '',
          author_name: book.author_name || '',
          category_name: book.category_name || '',
          publisher_name: book.publisher_name || '',
          total_copies: book.total_copies || 1,
          available_copies: book.available_copies || 1,
          edition: book.edition || '',
          year: book.year || '',
          language: book.language || 'English',
          shelf_location: book.shelf_location || '',
          download_url: book.download_url || '',
          description: book.description || ''
        });
        if (book.cover_image) {
          setCoverPreview(book.cover_image);
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

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
    setSaving(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });
    if (coverFile) {
      submissionData.append('cover_image', coverFile);
    }

    try {
      await updateBook(id, submissionData);
      navigate('/books');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error updating book data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Fetching book record data..." />;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header bar */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-gold p-2 rounded-circle d-flex align-items-center justify-content-center" onClick={() => navigate('/books')}>
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h4 className="fw-bold text-white mb-1">Edit Book Details</h4>
          <p className="text-secondary mb-0 fs-7">Modify catalog details for "{formData.title}".</p>
        </div>
      </div>

      {error && <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0">{error}</div>}

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">BOOK TITLE *</label>
                <input type="text" name="title" className="form-control custom-input" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">ISBN NUMBER *</label>
                <input type="text" name="isbn" className="form-control custom-input" value={formData.isbn} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">AUTHOR NAME *</label>
                <input type="text" name="author_name" className="form-control custom-input" value={formData.author_name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">CATEGORY *</label>
                <input type="text" name="category_name" className="form-control custom-input" value={formData.category_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">PUBLISHER NAME</label>
                <input type="text" name="publisher_name" className="form-control custom-input" value={formData.publisher_name} onChange={handleChange} />
              </div>

              <div className="row g-3">
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">TOTAL *</label>
                    <input type="number" name="total_copies" min="1" className="form-control custom-input" value={formData.total_copies} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">AVAILABLE *</label>
                    <input type="number" name="available_copies" min="0" className="form-control custom-input" value={formData.available_copies} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">EDITION</label>
                    <input type="text" name="edition" className="form-control custom-input" value={formData.edition} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">YEAR</label>
                    <input type="number" name="year" className="form-control custom-input" value={formData.year} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label text-secondary fs-7 fw-semibold">SHELF LOCATION</label>
                    <input type="text" name="shelf_location" className="form-control custom-input" value={formData.shelf_location} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">BOOK COVER PHOTO</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <input type="file" id="coverUpload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="coverUpload" className="btn btn-outline-gold d-flex align-items-center gap-2 py-2">
                      <FaUpload /> Replace Cover
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

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">DESCRIPTION & SYNOPSIS</label>
                <textarea name="description" className="form-control custom-input" rows="4" value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-end gap-3 mt-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/books')}>Cancel</button>
              <button type="submit" className="btn btn-gold" disabled={saving}>
                {saving ? 'UPDATING...' : 'UPDATE RECORD'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
