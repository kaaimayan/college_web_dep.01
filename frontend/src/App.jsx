import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages Import
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import Reservations from './pages/Reservations';
import Fine from './pages/Fine';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Helper component for Staff/Librarian-only routes
const StaffOnly = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === 'student') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const Layout = () => {
  const [sidebarShow, setSidebarShow] = useState(false);

  const toggleSidebar = () => {
    setSidebarShow(!sidebarShow);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar show={sidebarShow} onToggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        {/* Top Sticky Header */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Dynamic Route Content */}
        <main className="app-content">
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="books/add" element={<StaffOnly><AddBook /></StaffOnly>} />
            <Route path="books/edit/:id" element={<StaffOnly><EditBook /></StaffOnly>} />
            <Route path="students" element={<Students />} />
            <Route path="students/add" element={<StaffOnly><AddStudent /></StaffOnly>} />
            <Route path="students/edit/:id" element={<StaffOnly><EditStudent /></StaffOnly>} />
            <Route path="issue" element={<StaffOnly><IssueBook /></StaffOnly>} />
            <Route path="return" element={<StaffOnly><ReturnBook /></StaffOnly>} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="fines" element={<StaffOnly><Fine /></StaffOnly>} />
            <Route path="reports" element={<StaffOnly><Reports /></StaffOnly>} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="register" element={<StaffOnly><Register /></StaffOnly>} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Authenticated Layout */}
        <Route path="/*" element={<PrivateRoute />}>
          <Route path="*" element={<Layout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
