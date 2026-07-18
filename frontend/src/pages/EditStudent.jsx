import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, updateStudent } from '../services/students';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    year: 1,
    address: '',
    is_active: 1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const student = await getStudent(id);
        setFormData({
          student_id: student.student_id || '',
          name: student.name || '',
          email: student.email || '',
          phone: student.phone || '',
          department: student.department || '',
          year: student.year || 1,
          address: student.address || '',
          is_active: student.is_active ?? 1
        });
      } catch (err) {
        console.error(err);
        setError('Error fetching student details.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, is_active: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateStudent(id, formData);
      navigate('/students');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error updating student record.');
    } finally {
      setSaving(false);
    }
  };

 const depts = [
    'Computer Science', 'Home Science','Information Technology', 'Chemistry', 
    'Mathematics', 'Commerce','Tamil', 'English', 'Chronology','Bcom(CA)','Avacation Management',
  ];

  if (loading) return <Loader message="Fetching student profile data..." />;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-gold p-2 rounded-circle d-flex align-items-center justify-content-center" onClick={() => navigate('/students')}>
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h4 className="fw-bold text-white mb-1">Edit Student Profile</h4>
          <p className="text-secondary mb-0 fs-7">Modify parameters for student: {formData.name}.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0">{error}</div>}

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">ROLL ID / STUDENT ID *</label>
                <input type="text" name="student_id" className="form-control custom-input" value={formData.student_id} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">STUDENT FULL NAME *</label>
                <input type="text" name="name" className="form-control custom-input" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">EMAIL ADDRESS *</label>
                <input type="email" name="email" className="form-control custom-input" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">PHONE NUMBER</label>
                <input type="text" name="phone" className="form-control custom-input" value={formData.phone} onChange={handleChange} />
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
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">BORROWING STATUS *</label>
                <select className="form-select custom-input" value={formData.is_active} onChange={handleStatusChange}>
                  <option value={1}>Active / Allowed to Borrow</option>
                  <option value={0}>Suspended / Blocked Borrowing</option>
                </select>
              </div>
            </div>

            <div className="col-12">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7 fw-semibold">ADDRESS</label>
                <textarea name="address" className="form-control custom-input" rows="3" value={formData.address} onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-end gap-3 mt-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/students')}>Cancel</button>
              <button type="submit" className="btn btn-gold" disabled={saving}>
                {saving ? 'SAVING...' : 'UPDATE PROFILE'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
