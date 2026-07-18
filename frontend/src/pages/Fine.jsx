import React, { useState, useEffect } from 'react';
import { getFines, payFine } from '../services/transactions';
import Loader from '../components/Loader';
import { FaMoneyBillWave, FaCheck } from 'react-icons/fa';

const Fine = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPaid, setFilterPaid] = useState(''); // '' for all, 'true' for paid, 'false' for unpaid

  const fetchFines = async () => {
    try {
      const params = {};
      if (filterPaid === 'true') params.paid = true;
      if (filterPaid === 'false') params.paid = false;

      const data = await getFines(params);
      setFines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, [filterPaid]);

  const handlePayFine = async (id) => {
    try {
      await payFine(id);
      setFines(fines.map(f => f.id === id ? { ...f, paid: 1, paid_date: new Date().toISOString() } : f));
    } catch (err) {
      console.error(err);
      alert('Error updating payment status.');
    }
  };

  // Calculate stats summaries
  const unpaidTotal = fines.filter(f => !f.paid).reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const paidTotal = fines.filter(f => f.paid).reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold text-white mb-1">Fine Registry</h4>
        <p className="text-secondary mb-0 fs-7">Track and process outstanding student overdue fine logs.</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="glass-card d-flex align-items-center justify-content-between p-4" style={{ borderLeft: '4px solid #ef4444' }}>
            <div>
              <span className="text-secondary fs-8 fw-semibold uppercase mb-1 d-block">TOTAL OUTSTANDING FINES</span>
              <h3 className="text-white fw-bold mb-0">₹{unpaidTotal.toFixed(2)}</h3>
            </div>
            <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
              <FaMoneyBillWave size={28} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="glass-card d-flex align-items-center justify-content-between p-4" style={{ borderLeft: '4px solid #10b981' }}>
            <div>
              <span className="text-secondary fs-8 fw-semibold uppercase mb-1 d-block">TOTAL COLLECTED FINES</span>
              <h3 className="text-white fw-bold mb-0">₹{paidTotal.toFixed(2)}</h3>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
              <FaMoneyBillWave size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="glass-card p-3">
        <div className="d-flex align-items-center gap-3">
          <span className="text-secondary fs-7 fw-semibold">FILTER STATUS:</span>
          <div className="btn-group" role="group">
            <button className={`btn btn-sm ${filterPaid === '' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilterPaid('')}>All Records</button>
            <button className={`btn btn-sm ${filterPaid === 'false' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilterPaid('false')}>Unpaid Dues</button>
            <button className={`btn btn-sm ${filterPaid === 'true' ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => setFilterPaid('true')}>Paid Receipts</button>
          </div>
        </div>
      </div>

      {/* Fines Table */}
      {loading ? (
        <Loader message="Fetching fines logs..." />
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll ID</th>
                  <th>Book Title</th>
                  <th>Days Overdue</th>
                  <th>Fine Amount</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.length > 0 ? (
                  fines.map((fine) => (
                    <tr key={fine.id}>
                      <td className="fw-semibold text-white">{fine.student_name}</td>
                      <td className="text-warning">{fine.student_roll}</td>
                      <td>{fine.book_title}</td>
                      <td>{fine.days_overdue} Days</td>
                      <td className="fw-bold text-white">₹{parseFloat(fine.amount).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${fine.paid ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-2.5 py-1.5`}>
                          {fine.paid ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>
                      <td className="text-end">
                        {!fine.paid ? (
                          <button className="btn btn-outline-gold btn-sm d-inline-flex align-items-center gap-1.5" onClick={() => handlePayFine(fine.id)}>
                            <FaCheck size={10} /> Mark Paid
                          </button>
                        ) : (
                          <span className="text-muted fs-8">Paid {new Date(fine.paid_date).toLocaleDateString()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-5">No fine records logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fine;
