import React, { useState } from 'react';
import { register } from '../services/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('librarian');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(name, email, password, role);
      setSuccess('Librarian account registered successfully.');
      setName('');
      setEmail('');
      setPassword('');
      setRole('librarian');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card max-w-md mx-auto">
      <h4 className="text-warning fw-bold mb-4">REGISTER NEW STAFF MEMBER</h4>

      {error && <div className="alert alert-danger fs-7 border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}
      {success && <div className="alert alert-success fs-7 border-0 bg-success bg-opacity-10 text-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-secondary fs-7 fw-semibold">FULL NAME</label>
          <input
            type="text"
            className="form-control custom-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary fs-7 fw-semibold">EMAIL ADDRESS</label>
          <input
            type="email"
            className="form-control custom-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary fs-7 fw-semibold">TEMPORARY PASSWORD</label>
          <input
            type="password"
            className="form-control custom-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-secondary fs-7 fw-semibold">SYSTEM ROLE</label>
          <select 
            className="form-select custom-input" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="librarian">Librarian (Standard Access)</option>
            <option value="admin">Administrator (Full Access)</option>
          </select>
        </div>

        <button type="submit" className="btn btn-gold w-100 py-2.5" disabled={loading}>
          {loading ? 'CREATING PROFILE...' : 'REGISTER ACCOUNT'}
        </button>
      </form>
    </div>
  );
};

export default Register;
