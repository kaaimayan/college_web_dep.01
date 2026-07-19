import React, { useState, useEffect } from 'react';
import * as services from '../services/transactions';
import Loader from '../components/Loader';
import { FaPrint, FaFileCsv } from 'react-icons/fa';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReportData = async () => {
    setLoading(true);
    try {
      let result = [];
      if (activeTab === 'books') {
        result = await services.getBooksReport();
      } else if (activeTab === 'students') {
        result = await services.getStudentsReport();
      } else if (activeTab === 'transactions') {
        result = await services.getTransactionsReport();
      } else if (activeTab === 'fines') {
        result = await services.getFinesReport();
      }
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [activeTab]);

  // Export report to CSV
  const handleExportCSV = () => {
    if (data.length === 0) return;
    
    // Generate headers
    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(row => keys.map(key => `"${String(row[key] ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KR_College_LMS_${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export report for printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-black mb-1">Reports & Ledger Summaries</h4>
          <p className="text-secondary mb-0 fs-7">Generate data exports and print inventory reports.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-gold d-flex align-items-center gap-1.5" onClick={handleExportCSV} disabled={data.length === 0}>
            <FaFileCsv /> Export Excel/CSV
          </button>
          <button className="btn btn-gold d-flex align-items-center gap-1.5" onClick={handlePrint} disabled={data.length === 0}>
            <FaPrint /> Print Report
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="glass-card p-2 d-flex justify-content-start gap-2 overflow-x-auto">
        <button className={`btn btn-sm ${activeTab === 'books' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setActiveTab('books')}>Book Inventory</button>
        <button className={`btn btn-sm ${activeTab === 'students' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setActiveTab('students')}>Students Audit</button>
        <button className={`btn btn-sm ${activeTab === 'transactions' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setActiveTab('transactions')}>Transactions History</button>
        <button className={`btn btn-sm ${activeTab === 'fines' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setActiveTab('fines')}>Fines Dues Ledger</button>
      </div>

      {/* Display Grid */}
      {loading ? (
        <Loader message="Compiling reports datasets..." />
      ) : (
        <div className="glass-card p-0 overflow-hidden" id="printable-report-area">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              {activeTab === 'books' && (
                <>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>ISBN</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Copies</th>
                      <th>Shelf Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((book) => (
                        <tr key={book.id}>
                          <td className="fw-bold text-black">{book.title}</td>
                          <td>{book.isbn}</td>
                          <td>{book.author_name}</td>
                          <td>{book.category_name}</td>
                          <td>{book.available_copies} / {book.total_copies} Available</td>
                          <td><span className="badge bg-secondary">{book.shelf_location || 'N/A'}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="text-center text-secondary py-4">No books registered.</td></tr>
                    )}
                  </tbody>
                </>
              )}

              {activeTab === 'students' && (
                <>
                  <thead>
                    <tr>
                      <th>Roll ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Loans</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((stud) => (
                        <tr key={stud.student_id}>
                          <td className="fw-bold text-warning">{stud.student_id}</td>
                          <td>{stud.name}</td>
                          <td>{stud.department}</td>
                          <td>Year {stud.year}</td>
                          <td>{stud.active_loans} active loans</td>
                          <td>
                            <span className={`badge ${stud.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {stud.is_active ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="text-center text-secondary py-4">No students registered.</td></tr>
                    )}
                  </tbody>
                </>
              )}

              {activeTab === 'transactions' && (
                <>
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Student</th>
                      <th>Roll ID</th>
                      <th>Issued Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((tx) => (
                        <tr key={tx.id}>
                          <td className="fw-bold text-black">{tx.book_title}</td>
                          <td>{tx.student_name}</td>
                          <td className="text-warning">{tx.student_roll}</td>
                          <td>{new Date(tx.issued_date).toLocaleDateString()}</td>
                          <td>{new Date(tx.due_date).toLocaleDateString()}</td>
                          <td>{tx.return_date ? new Date(tx.return_date).toLocaleDateString() : '--'}</td>
                          <td>
                            <span className={`badge ${tx.status === 'returned' ? 'bg-success' : tx.status === 'overdue' ? 'bg-danger' : 'bg-info'}`}>
                              {tx.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="text-center text-secondary py-4">No transaction logs logged.</td></tr>
                    )}
                  </tbody>
                </>
              )}

              {activeTab === 'fines' && (
                <>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll ID</th>
                      <th>Book</th>
                      <th>Days Overdue</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((fine) => (
                        <tr key={fine.id}>
                          <td className="fw-bold text-white">{fine.student_name}</td>
                          <td className="text-warning">{fine.student_roll}</td>
                          <td>{fine.book_title}</td>
                          <td>{fine.days_overdue} days</td>
                          <td className="fw-bold text-white">₹{parseFloat(fine.amount).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${fine.paid ? 'bg-success' : 'bg-danger'}`}>
                              {fine.paid ? 'PAID' : 'UNPAID'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="text-center text-secondary py-4">No fine records logged.</td></tr>
                    )}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
