import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaBell } from 'react-icons/fa';
import krLogo from '../assets/Krlogo.png';

export const LogoSVG = () => (
  <img
    src={krLogo}
    alt="KR College Logo"
    width="50"
    height="50"
    style={{
      borderRadius: '50%',
      objectFit: 'cover',
      filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.4))'
    }}
  />
);

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="app-navbar navbar navbar-expand-lg">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* Left branding */}
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-link text-white d-lg-none p-0 me-2" 
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <LogoSVG />
          
          <div className="d-flex flex-column">
            <span className="fs-5 fw-bold text-blue mb-0" style={{ letterSpacing: '0.5px' }}>
              KR Arts And Science College
            </span>
            <span className="text-secondary fw-medium" style={{ fontSize: '10.5px', letterSpacing: '0.8px' }}>
              உள்ளுவதெல்லாம் உயர்வுள்ளல்
            </span>
          </div>
        </div>

        {/* Right Info */}
        <div className="d-flex align-items-center gap-4">
          <button className="btn btn-link text-secondary p-0 position-relative" style={{ transition: 'color 0.3s' }}>
            <FaBell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>

          <div className="dropdown">
            <button 
              className="btn btn-link text-white d-flex align-items-center gap-2 p-0 decoration-none dropdown-toggle border-0" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ textDecoration: 'none' }}
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="avatar" 
                  className="rounded-circle border border-warning" 
                  width="36" 
                  height="36" 
                  style={{ objectFit: 'cover' }} 
                />
              ) : (
                <FaUserCircle size={32} className="text-warning" />
              )}
              <span className="d-none d-md-inline fw-semibold text-secondary" style={{ fontSize: '14px' }}>
                {user?.name || 'Administrator'}
              </span>
            </button>
            
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark glass-card p-2 border-0 mt-2" style={{ width: '200px' }}>
              <li>
                <Link className="dropdown-item rounded-3 py-2" to="/profile">
                  My Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-3 py-2" to="/settings">
                  Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider border-secondary" /></li>
              <li>
                <button className="dropdown-item rounded-3 py-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                  <FaSignOutAlt /> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
