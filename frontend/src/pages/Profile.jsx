import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/auth';
import { FaUserCircle, FaKey } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row g-4">
      {/* Left Profile details info */}
      <div className="col-12 col-md-5">
        <div className="glass-card text-center h-100 py-5">
          <div className="mb-4">
            <FaUserCircle size={100} className="text-warning animate-float" />
          </div>
          <h4 className="fw-bold text-white mb-1">{user?.name}</h4>
          <p className="text-secondary mb-3">{user?.email}</p>
          
          <span className="badge bg-warning text-dark px-3 py-2 fw-semibold mb-4 text-uppercase">
            {user?.role} ACCOUNT
          </span>

          <div className="text-start border-top border-secondary pt-4 px-3 fs-8 text-secondary">
            <p className="mb-2"><strong>Account Status:</strong> <span className="text-success">Active</span></p>
            <p className="mb-0"><strong>Managed By:</strong> KR Arts & Science College</p>
          </div>
        </div>
      </div>

      {/* Right Password Update Details */}
      <div className="col-12 col-md-7">
        <div className="glass-card">
          <h5 className="text-warning fw-bold mb-4 d-flex align-items-center gap-2">
            <FaKey /> SECURITY SETTINGS
          </h5>

          {error && <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0 fs-7">{error}</div>}
          {success && <div className="alert alert-success bg-success bg-opacity-10 text-success border-0 fs-7">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary fs-7 fw-semibold">CURRENT PASSWORD</label>
              <input
                type="password"
                className="form-control custom-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary fs-7 fw-semibold">NEW PASSWORD</label>
              <input
                type="password"
                className="form-control custom-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary fs-7 fw-semibold">CONFIRM NEW PASSWORD</label>
              <input
                type="password"
                className="form-control custom-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold w-100 py-2.5" disabled={loading}>
              {loading ? 'SAVING CHANGES...' : 'UPDATE SYSTEM PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
