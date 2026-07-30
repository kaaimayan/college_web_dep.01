import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import krLogo from '../assets/Krlogo.png'; 
import { FaUserGraduate, FaUserShield } from 'react-icons/fa';

const Login = () => {
  const [loginTab, setLoginTab] = useState('staff'); // 'staff' or 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setLoginTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="login-container">
      {/* Background particles */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '200px',
          height: '200px',
          background: 'rgba(245, 158, 11, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }}
      ></div>
      <div 
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 12s ease-in-out infinite'
        }}
      ></div>

      <div className="login-card-3d text-center" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="college-logo-3d">  
          <img src={krLogo} alt="KR Arts & Science College Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        </div>

        <h3 className="college-name mb-1 uppercase">KR Arts & Science College</h3>
        <p className="college-tagline mb-4">உள்ளுவதெல்லாம் உயர்வுள்ளல்</p>
        
        {/* Portal Selection Tabs */}
        <div className="d-flex rounded-3 p-1 mb-4" style={{ background: 'rgba(239, 246, 255, 0.8)', border: '1px solid var(--card-border)' }}>
          <button
            type="button"
            className={`btn flex-fill py-2 fs-7 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2 transition-all ${
              loginTab === 'staff' ? 'btn-gold text-white shadow' : 'text-dark border-0'
            }`}
            onClick={() => handleTabChange('staff')}
          >
            <FaUserShield size={14} /> Staff / Librarian
          </button>
          <button
            type="button"
            className={`btn flex-fill py-2 fs-7 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2 transition-all ${
              loginTab === 'student' ? 'btn-gold text-white shadow' : 'text-dark border-0'
            }`}
            onClick={() => handleTabChange('student')}
          >
            <FaUserGraduate size={14} /> Student Portal
          </button>
        </div>

        <h6 className="fw-bold mb-3 text-uppercase fs-7" style={{ letterSpacing: '1px' }}>
          {loginTab === 'staff' ? 'Staff & Administrator Login' : 'Student Portal Authentication'}
        </h6>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 py-2.5 fs-7 mb-3 text-start" style={{ background: 'rgba(220, 53, 69, 0.15)', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="text-dark fw-semibold fs-7 mb-1">
              {loginTab === 'staff' ? 'STAFF EMAIL ADDRESS' : 'STUDENT EMAIL ADDRESS'}
            </label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder={loginTab === 'staff' ? 'e.g. librarian@krartsscience.edu' : 'e.g. student@krartsscience.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="text-dark fw-semibold fs-7 mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              loginTab === 'staff' ? 'ENTER STAFF PORTAL' : 'ENTER STUDENT PORTAL'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
