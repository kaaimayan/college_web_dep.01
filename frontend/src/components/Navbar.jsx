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
    <nav className="app-navbar navbar">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center flex-nowrap w-100">
        {/* Left branding */}
        <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0" style={{ maxWidth: 'calc(100% - 100px)' }}>
          <button
            type="button"
            className="btn btn-clay-icon d-lg-none flex-shrink-0"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="navbar-logo-wrap flex-shrink-0">
            <LogoSVG />
          </div>

          <div className="d-flex flex-column min-w-0">
            <span className="fw-bold text-blue mb-0 text-truncate navbar-college-title" style={{ letterSpacing: '0.4px' }}>
              KR Arts &amp; Science College
            </span>
            <span className="text-secondary fw-medium navbar-college-subtitle d-none d-sm-block text-truncate" style={{ fontSize: '10.5px', letterSpacing: '0.8px' }}>
              உள்ளுவதெல்லாம் உயர்வுள்ளல்
            </span>
          </div>
        </div>

        {/* Right Info */}
        <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
          <button 
            type="button"
            className="btn btn-clay-icon position-relative" 
            style={{ transition: 'color 0.3s' }}
            aria-label="Notifications"
          >
            <FaBell size={17} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>

          <div className="dropdown">
            <button
              className="btn btn-link d-flex align-items-center gap-1 gap-sm-2 p-0 decoration-none dropdown-toggle border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ textDecoration: 'none', color: '#000000' }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="rounded-circle border border-warning"
                  width="34"
                  height="34"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <FaUserCircle size={30} className="text-warning" />
              )}
              <span className="d-none d-md-inline fw-semibold text-dark text-truncate" style={{ maxWidth: '120px', fontSize: '13.5px', color: '#000000' }}>
                {user?.name || 'Administrator'}
              </span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end glass-card p-2 border-0 mt-2 shadow-lg" style={{ width: '200px', background: 'rgba(255, 255, 255, 0.98)' }}>
              <li>
                <Link className="dropdown-item rounded-3 py-2 text-dark fw-semibold" to="/profile" style={{ color: '#000000' }}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-3 py-2 text-dark fw-semibold" to="/settings" style={{ color: '#000000' }}>
                  Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider border-secondary my-1" /></li>
              <li>
                <button className="dropdown-item rounded-3 py-2 text-dark fw-semibold d-flex align-items-center gap-2" onClick={handleLogout} style={{ color: '#000000' }}>
                  <FaSignOutAlt className="text-danger" /> Sign Out
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
