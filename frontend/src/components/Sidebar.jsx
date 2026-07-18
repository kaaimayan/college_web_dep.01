import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoSVG } from './Navbar';
import { 
  FaBook, FaUserGraduate, FaHandHolding, FaUndo, 
  FaCalendarAlt, FaMoneyBill, FaChartBar, FaUser, FaCog, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar = ({ show, onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [booksOpen, setBooksOpen] = useState(location.pathname.startsWith('/books'));
  const [studentsOpen, setStudentsOpen] = useState(location.pathname.startsWith('/students'));

  const toggleBooks = (e) => {
    e.preventDefault();
    setBooksOpen(!booksOpen);
  };

  const toggleStudents = (e) => {
    e.preventDefault();
    setStudentsOpen(!studentsOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 992) {
      onToggleSidebar();
    }
  };

  return (
    <aside className={`app-sidebar ${show ? 'show' : ''}`}>
      {/* Sidebar Header */}
      <div className="app-sidebar-logo">
        <LogoSVG />
        <div className="d-flex flex-column">
          <span className="fw-bold text-blue fs-6 mb-0" style={{ letterSpacing: '0.5px' }}>KR COLLEGE</span>
          <span className="text-secondary fw-semibold" style={{ fontSize: '10px' }}>LMS PLATFORM</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="app-sidebar-menu">
        {/* Dashboard Link */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <MdDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* Books Menu */}
        <div>
          <a 
            href="#booksMenu" 
            onClick={toggleBooks} 
            className={`app-sidebar-item d-flex justify-content-between align-items-center ${location.pathname.startsWith('/books') ? 'text-warning' : ''}`}
          >
            <div className="d-flex align-items-center gap-3">
              <FaBook size={18} />
              <span>Book Catalog</span>
            </div>
            {booksOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </a>
          
          {booksOpen && (
            <div className="ps-4 mb-2 animate-fadeIn">
              <NavLink 
                to="/books" 
                end
                className={({ isActive }) => `app-sidebar-item py-2 fs-7 ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                All Books
              </NavLink>
              <NavLink 
                to="/books/add" 
                className={({ isActive }) => `app-sidebar-item py-2 fs-7 ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                Add Book
              </NavLink>
            </div>
          )}
        </div>

        {/* Students Menu */}
        <div>
          <a 
            href="#studentsMenu" 
            onClick={toggleStudents} 
            className={`app-sidebar-item d-flex justify-content-between align-items-center ${location.pathname.startsWith('/students') ? 'text-warning' : ''}`}
          >
            <div className="d-flex align-items-center gap-3">
              <FaUserGraduate size={18} />
              <span>Students</span>
            </div>
            {studentsOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </a>
          
          {studentsOpen && (
            <div className="ps-4 mb-2 animate-fadeIn">
              <NavLink 
                to="/students" 
                end
                className={({ isActive }) => `app-sidebar-item py-2 fs-7 ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                All Students
              </NavLink>
              <NavLink 
                to="/students/add" 
                className={({ isActive }) => `app-sidebar-item py-2 fs-7 ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                Add Student
              </NavLink>
            </div>
          )}
        </div>

        {/* Transactions list */}
        <NavLink 
          to="/issue" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaHandHolding size={18} />
          <span>Issue Book</span>
        </NavLink>

        <NavLink 
          to="/return" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaUndo size={18} />
          <span>Return Book</span>
        </NavLink>

        <NavLink 
          to="/reservations" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaCalendarAlt size={18} />
          <span>Reservations</span>
        </NavLink>

        <NavLink 
          to="/fines" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaMoneyBill size={18} />
          <span>Fine Registry</span>
        </NavLink>

        <NavLink 
          to="/reports" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaChartBar size={18} />
          <span>Reports & Stats</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaUser size={18} />
          <span>My Profile</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <FaCog size={18} />
          <span>Settings</span>
        </NavLink>
      </div>

      {/* Footer Role Display */}
      <div className="pt-3 border-top border-secondary text-center">
        <span className="badge bg-warning text-dark fw-bold uppercase py-2 px-3 w-100 rounded-3">
          {user?.role === 'admin' ? 'ADMIN PRIVILEGES' : 'LIBRARIAN'}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
