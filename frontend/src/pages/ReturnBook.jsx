import React, { useState, useEffect } from 'react';
import { getTransactions, returnBook } from '../services/transactions';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import { FaUndo, FaMoneyBillWave } from 'react-icons/fa';
import Modal from '../components/Modal';

const ReturnBook = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [returningId, setReturningId] = useState(null);
  const [returningTx, setReturningTx] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchIssues = async () => {
    try {
      const data = await getTransactions({ status: 'issued', search });
      setIssues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [search]);

  const handleReturnClick = (tx) => {
    setReturningTx(tx);
    setReturningId(tx.id);
    
    // Calculate live fine preview
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(tx.due_date);
    due.setHours(0,0,0,0);
    
    let days = 0;
    let fine = 0;
    if (today > due) {
      const diff = today.getTime() - due.getTime();
      days = Math.ceil(diff / (1000 * 3600 * 24));
      fine = days * 2.00; // Rs. 2 per day
    }
    
    setReturningTx({ ...tx, calculatedOverdueDays: days, calculatedFine: fine });
    setShowConfirmModal(true);
  };

  const handleConfirmReturn = async () => {
    setProcessing(true);
    try {
      const res = await returnBook({
        transaction_id: returningId,
        return_date: new Date().toISOString().split('T')[0]
      });

      setSuccess(`Book returned successfully! ${res.daysOverdue > 0 ? `Logged Fine of ₹${res.fineAmount} for ${res.daysOverdue} overdue days.` : 'No fine logged.'}`);
      
      // Clear from active lists
      setIssues(issues.filter(i => i.id !== returningId));
      setShowConfirmModal(false);
      setReturningId(null);
      setReturningTx(null);
    } catch (err) {
      console.error(err);
      alert('Error saving return log.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold text-white mb-1">Return Book Workflow</h4>
        <p className="text-secondary mb-0 fs-7">Search active borrowing records to log a return and calculate fine dues.</p>
      </div>

      {success && <div className="alert alert-success bg-success bg-opacity-10 text-success border-0">{success}</div>}

      <div className="glass-card p-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search active issues by student name, roll, or book title..." />
      </div>

      {loading ? (
        <Loader message="Fetching active loans registry..." />
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student Name</th>
                  <th>Roll ID</th>
                  <th>Issued Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.length > 0 ? (
                  issues.map((tx) => {
                    const isOverdue = new Date(tx.due_date) < new Date();
                    return (
                      <tr key={tx.id}>
                        <td>
                          <div className="fw-bold text-white">{tx.book_title}</div>
                          <div className="text-muted fs-8">ISBN: {tx.book_isbn}</div>
                        </td>
                        <td>{tx.student_name}</td>
                        <td className="text-warning">{tx.student_roll}</td>
                        <td>{new Date(tx.issued_date).toLocaleDateString()}</td>
                        <td>{new Date(tx.due_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${isOverdue ? 'bg-danger-subtle text-danger' : 'bg-info-subtle text-info'} px-2.5 py-1.5`}>
                            {isOverdue ? 'Overdue' : 'On Loan'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button className="btn btn-outline-gold btn-sm d-inline-flex align-items-center gap-1.5" onClick={() => handleReturnClick(tx)}>
                            <FaUndo size={12} /> Log Return
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-5">No active borrowing logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {returningTx && (
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          title="Confirm Book Return"
          footerActions={
            <>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-gold btn-sm" onClick={handleConfirmReturn} disabled={processing}>
                {processing ? 'Processing...' : 'Confirm Return'}
              </button>
            </>
          }
        >
          <div className="fs-7">
            <p className="mb-2">Are you sure you want to log the return of:</p>
            <h6 className="text-warning mb-3 fw-bold">{returningTx.book_title}</h6>
            <p className="mb-1"><strong>Borrowed By:</strong> {returningTx.student_name} ({returningTx.student_roll})</p>
            <p className="mb-3"><strong>Due Date:</strong> {new Date(returningTx.due_date).toLocaleDateString()}</p>
            
            {returningTx.calculatedFine > 0 ? (
              <div className="alert alert-warning border-0 p-3 d-flex align-items-center gap-2" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <FaMoneyBillWave size={20} />
                <div>
                  <div className="fw-bold">OVERDUE DETECTED ({returningTx.calculatedOverdueDays} DAYS)</div>
                  <div className="fs-8">Fine logged to student ledger: ₹{returningTx.calculatedFine.toFixed(2)} (₹2.00/day)</div>
                </div>
              </div>
            ) : (
              <div className="alert alert-success border-0 p-3" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                Book returned on time. No fine logged.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReturnBook;
