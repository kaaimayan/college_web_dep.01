import React, { useState, useEffect } from 'react';
import { getStudents } from '../services/students';
import { getBooks } from '../services/books';
import { issueBook } from '../services/transactions';
import Loader from '../components/Loader';
import { FaBook, FaUserGraduate, FaCalendarCheck } from 'react-icons/fa';

const IssueBook = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      try {
        const studentList = await getStudents();
        const activeStudents = studentList.filter(s => s.is_active === 1);
        setStudents(activeStudents);

        const bookList = await getBooks();
        const availableBooks = bookList.filter(b => b.available_copies > 0);
        setBooks(availableBooks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  // Recalculate default due date (+14 days) on issueDate change
  useEffect(() => {
    if (issueDate) {
      const issue = new Date(issueDate);
      issue.setDate(issue.getDate() + 14);
      setDueDate(issue.toISOString().split('T')[0]);
    }
  }, [issueDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedStudent || !selectedBook) {
      setError('Please select both a student and a book.');
      return;
    }

    setSubmitting(true);
    try {
      await issueBook({
        student_id: selectedStudent,
        book_id: selectedBook,
        issued_date: issueDate,
        due_date: dueDate
      });
      setSuccess('Book successfully issued to student!');
      
      // Update local available books copy count
      setBooks(books.map(b => b.id === parseInt(selectedBook) ? { ...b, available_copies: b.available_copies - 1 } : b).filter(b => b.available_copies > 0));
      setSelectedBook('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error processing book issue transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentBook = books.find(b => b.id === parseInt(selectedBook));
  const currentStudent = students.find(s => s.id === parseInt(selectedStudent));

  if (loading) return <Loader message="Loading registry parameters..." />;

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold text-white mb-1">Issue Book Workflow</h4>
        <p className="text-secondary mb-0 fs-7">Process library borrowing logs and define due parameters.</p>
      </div>

      {error && <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0">{error}</div>}
      {success && <div className="alert alert-success bg-success bg-opacity-10 text-success border-0">{success}</div>}

      <div className="row g-4">
        {/* Left Side Inputs Form */}
        <div className="col-12 col-lg-7">
          <div className="glass-card">
            <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-4" style={{ letterSpacing: '1px' }}>
              Issue Details Form
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">SELECT STUDENT *</label>
                <select
                  className="form-select custom-input"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                >
                  <option value="">-- Choose Student (Active Profiles Only) --</option>
                  {students.map((stud) => (
                    <option key={stud.id} value={stud.id}>{stud.name} ({stud.student_id}) - {stud.department}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">SELECT BOOK TO ISSUE *</label>
                <select
                  className="form-select custom-input"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  required
                >
                  <option value="">-- Choose Book (In Stock Only) --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title} (ISBN: {book.isbn}) - [{book.available_copies} available]</option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-secondary fs-7 fw-semibold">ISSUE DATE</label>
                  <input
                    type="date"
                    className="form-control custom-input"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fs-7 fw-semibold">DUE DATE (14 DAYS LOAN)</label>
                  <input
                    type="date"
                    className="form-control custom-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
                <FaCalendarCheck /> {submitting ? 'PROCESSING ISSUE...' : 'AUTHORIZE BOOK ISSUE'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Resource Details Preview */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          {/* Selected Student Panel */}
          <div className="glass-card flex-grow-1">
            <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-3" style={{ letterSpacing: '1px' }}>
              Student Profile Preview
            </h6>
            {currentStudent ? (
              <div className="d-flex align-items-center gap-3">
                <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <FaUserGraduate size={22} className="text-white" />
                </div>
                <div className="fs-7">
                  <h6 className="text-white mb-0 fw-bold">{currentStudent.name}</h6>
                  <p className="text-secondary mb-0">Roll ID: {currentStudent.student_id}</p>
                  <p className="text-muted mb-0">{currentStudent.department} | Year {currentStudent.year}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted py-4 fs-7">Select a student from the dropdown menu to preview profile.</div>
            )}
          </div>

          {/* Selected Book Panel */}
          <div className="glass-card flex-grow-1">
            <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-3" style={{ letterSpacing: '1px' }}>
              Book Details Preview
            </h6>
            {currentBook ? (
              <div className="d-flex gap-3">
                {currentBook.cover_image ? (
                  <img src={currentBook.cover_image} alt={currentBook.title} className="rounded-2 border border-secondary" style={{ width: '60px', height: '80px', objectFit: 'cover' }} />
                ) : (
                  <div className="rounded-2 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center text-muted" style={{ width: '60px', height: '80px', border: '1px dashed var(--accent-gold)' }}>
                    <FaBook />
                  </div>
                )}
                <div className="fs-7 flex-grow-1">
                  <h6 className="text-white mb-1 fw-bold line-clamp-1">{currentBook.title}</h6>
                  <p className="text-secondary mb-1">Author: {currentBook.author_name}</p>
                  <p className="text-muted mb-0 fs-8">Location: <span className="badge bg-dark border border-secondary">{currentBook.shelf_location || 'N/A'}</span></p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted py-4 fs-7">Select a book from the catalog to preview cover details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
