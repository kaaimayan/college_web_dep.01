import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../services/students';
import { FaArrowLeft } from 'react-icons/fa';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    name: 'your name',
    email: 'some@gmail.com',
    phone: '',
    department: 'Computer Science',
    year: 1,
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createStudent(formData);
      navigate('/students');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error creating student record.');
    } finally {
      setLoading(false);
    }
  };

  const depts = [
    'Computer Science', 'Home Science','Information Technology', 'Chemistry', 
    'Mathematics', 'Commerce','Tamil', 'English', 'Chronology','Bcom(CA)','Avacation Management',
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-gold p-2 rounded-circle d-flex align-items-center justify-content-center" onClick={() => navigate('/students')}>
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h4 className="fw-bold text-white mb-1">Add New Student</h4>
          <p className="text-secondary mb-0 fs-7">Register a student record for borrowing privileges.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0">{error}</div>}

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">ROLL ID / STUDENT ID *</label>
                <input type="text" name="student_id" className="form-control custom-input" placeholder="e.g. KR24CS001" value={formData.student_id} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">STUDENT FULL NAME *</label>
                <input type="text" name="name" className="form-control custom-input" placeholder="e.g. Arun Kumar" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">EMAIL ADDRESS *</label>
                <input type="email" name="email" className="form-control custom-input" placeholder="e.g. student@krartsscience.edu" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">PHONE NUMBER</label>
                <input type="text" name="phone" className="form-control custom-input" placeholder="e.g. 9876543210" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">DEPARTMENT *</label>
                <select name="department" className="form-select custom-input" value={formData.department} onChange={handleChange}>
                  {depts.map((d, index) => (
                    <option key={index} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">YEAR OF STUDY *</label>
                <select name="year" className="form-select custom-input" value={formData.year} onChange={handleChange}>
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                </select>
              </div>
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">ADDRESS</label>
                <textarea name="address" className="form-control custom-input" rows="3" placeholder="Residential or hostel address details..." value={formData.address} onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-end gap-3 mt-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/students')}>Cancel</button>
              <button type="submit" className="btn btn-gold" disabled={loading}>
                {loading ? 'REGISTERING...' : 'REGISTER STUDENT'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
