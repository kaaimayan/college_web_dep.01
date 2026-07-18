import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/transactions';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { FaBook, FaUserGraduate, FaHandHolding, FaUndo, FaMoneyBill, FaClock } from 'react-icons/fa';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader message="Generating analytics dashboards..." />;
  if (error) return <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0">{error}</div>;

  // Chart configuration: Books by Category (Doughnut)
  const categoryLabels = stats?.categoryDistribution?.map(c => c.category) || [];
  const categoryData = stats?.categoryDistribution?.map(c => c.count) || [];
  const categoryChartData = {
    labels: categoryLabels,
    datasets: [{
      label: 'Books',
      data: categoryData,
      backgroundColor: [
        'rgba(245, 158, 11, 0.7)',
        'rgba(99, 102, 241, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(14, 165, 233, 0.7)',
        'rgba(168, 85, 247, 0.7)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }]
  };

  // Chart configuration: Student distribution by Department (Bar)
  const deptLabels = stats?.deptDistribution?.map(d => d.department) || [];
  const deptData = stats?.deptDistribution?.map(d => d.count) || [];
  const deptChartData = {
    labels: deptLabels,
    datasets: [{
      label: 'Students Count',
      data: deptData,
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1,
      borderRadius: 8
    }]
  };

  // Setup options for dark theme charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Poppins' }
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Poppins' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Poppins' } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { family: 'Poppins', size: 10 }
        }
      }
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Welcome Message */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <h4 className="fw-bold text-blue mb-1">KR Arts & Science College - Library Console</h4>
          <p className="text-secondary mb-0 fs-7">Real-time status monitor and transaction management platform.</p>
        </div>
        <div className="text-end">
          <span className="badge bg-dark bg-opacity-50 text-warning px-3 py-2 fs-7 border border-secondary rounded-3">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
          <DashboardCard title="Total Books" value={stats.totalBooks} icon={<FaBook />} color="var(--accent-gold)" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
          <DashboardCard title="Available" value={stats.availableBooks} icon={<FaBook />} color="#10b981" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
          <DashboardCard title="Issued Books" value={stats.issuedBooks} icon={<FaHandHolding />} color="#6366f1" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
          <DashboardCard title="Students" value={stats.totalStudents} icon={<FaUserGraduate />} color="#0ea5e9" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
          <DashboardCard title="Overdue Books" value={stats.overdueBooks} icon={<FaClock />} color="#ef4444" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
          <DashboardCard title="Fines Paid" value={`₹${stats.fineCollected}`} icon={<FaMoneyBill />} color="#ec4899" />
        </div>
      </div>

      {/* Main Charts & Sidebars */}
      <div className="row g-4">
        {/* Left Side Charts */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          <div className="row g-4">
            {/* Books by Category Chart */}
            <div className="col-12 col-md-6">
              <div className="glass-card h-100" style={{ minHeight: '320px' }}>
                <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-4" style={{ letterSpacing: '1px' }}>
                  Books By Category
                </h6>
                <div style={{ height: '220px', position: 'relative' }}>
                  {categoryData.length > 0 ? (
                    <Doughnut data={categoryChartData} options={doughnutOptions} />
                  ) : (
                    <div className="text-center text-muted pt-5 fs-7">No books in catalog yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="col-12 col-md-6">
              <div className="glass-card h-100" style={{ minHeight: '320px' }}>
                <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-4" style={{ letterSpacing: '1px' }}>
                  Student Departments
                </h6>
                <div style={{ height: '220px', position: 'relative' }}>
                  {deptData.length > 0 ? (
                    <Bar data={deptChartData} options={chartOptions} />
                  ) : (
                    <div className="text-center text-muted pt-5 fs-7">No students registered yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="glass-card">
            <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-3" style={{ letterSpacing: '1px' }}>
              Quick Workflows
            </h6>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <Link to="/issue" className="quick-action-btn">
                  <FaHandHolding className="text-warning" />
                  <span className="fs-7">Issue Book</span>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/return" className="quick-action-btn">
                  <FaUndo className="text-success" />
                  <span className="fs-7">Return Book</span>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/books/add" className="quick-action-btn">
                  <FaBook className="text-info" />
                  <span className="fs-7">Add Book</span>
                </Link>
              </div>
              <div className="col-6 col-md-3">
                <Link to="/students/add" className="quick-action-btn">
                  <FaUserGraduate className="text-pink" style={{ color: '#ec4899' }} />
                  <span className="fs-7">Add Student</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Logs */}
        <div className="col-12 col-lg-4">
          <div className="glass-card h-100 d-flex flex-column" style={{ maxHeight: '550px', overflow: 'hidden' }}>
            <h6 className="text-warning fw-semibold text-uppercase fs-8 mb-3" style={{ letterSpacing: '1px' }}>
              System Logs & Activity
            </h6>
            <div className="flex-grow-1 overflow-y-auto pe-1 d-flex flex-column gap-2" style={{ maxHeight: '450px' }}>
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((log) => (
                  <div key={log.id} className="p-3 rounded-3" style={{ background: 'rgba(30, 41, 59, 0.4)', borderLeft: `3px solid ${log.action.includes('ISSUE') ? '#f59e0b' : log.action.includes('RETURN') ? '#10b981' : '#6366f1'}` }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-white fs-8">{log.action}</span>
                      <span className="text-muted fs-9">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-secondary fs-8 mb-1">{log.details}</p>
                    <div className="d-flex justify-content-between align-items-center fs-9 text-muted border-top border-secondary pt-1 mt-1">
                      <span>By: {log.user_name || 'System'}</span>
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5 fs-7">No system activity logs logged yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
