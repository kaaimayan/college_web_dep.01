import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoSVG } from '../components/Navbar';
import krLogo from '../assets/kr logo.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background design particles */}
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

      <div className="login-card-3d text-center">
        <div className="college-logo-3d">  
  <img src={krLogo} alt="KR Arts & Science College Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
</div>

        <h3 className="college-name mb-1 uppercase">KR Arts & Science College</h3>
        <p className="college-tagline mb-4">உள்ளுவதெல்லாம் உயர்வுள்ளல்</p>
        
        <h5 className="text-white fw-bold mb-4">LMS PORTAL LOGIN</h5>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 py-2.5 fs-7 mb-3 text-start" style={{ background: 'rgba(220, 53, 69, 0.15)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="text-secondary fw-semibold fs-7 mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              className="form-control custom-input"
              placeholder="e.g. admin@krartsscience.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="text-secondary fw-semibold fs-7 mb-1">PASSWORD</label>
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
            className="btn btn-gold w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              'ENTER SYSTEM'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top border-secondary text-start">
          <p className="text-muted fs-8 mb-1 fw-semibold uppercase" style={{ letterSpacing: '0.5px' }}>Demo Accounts:</p>
          <div className="bg-dark bg-opacity-25 rounded-3 p-2.5 fs-8 text-secondary">
            <div><strong>Admin:</strong> admin@krartsscience.edu / admin123</div>
            <div className="mt-1"><strong>Librarian:</strong> librarian@krartsscience.edu / librarian123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
