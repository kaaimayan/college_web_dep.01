import React, { useState, useEffect } from 'react';
import { getReservations, updateReservationStatus } from '../services/transactions';
import Loader from '../components/Loader';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRes = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRes();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold text-white mb-1">Book Reservations</h4>
        <p className="text-secondary mb-0 fs-7">Manage student requests for copies currently on loan.</p>
      </div>

      {loading ? (
        <Loader message="Fetching reservations data..." />
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student Name</th>
                  <th>Roll ID</th>
                  <th>Reserved Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((res) => (
                    <tr key={res.id}>
                      <td>
                        <div className="fw-bold text-white">{res.book_title}</div>
                        <div className="text-muted fs-8">ISBN: {res.book_isbn}</div>
                      </td>
                      <td>{res.student_name}</td>
                      <td className="text-warning">{res.student_roll}</td>
                      <td>{new Date(res.reserved_date).toLocaleDateString()}</td>
                      <td>{new Date(res.expiry_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${res.status === 'pending' ? 'bg-warning-subtle text-warning' : res.status === 'fulfilled' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-2.5 py-1.5`}>
                          {res.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end">
                        {res.status === 'pending' && (
                          <div className="d-inline-flex gap-2">
                            <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1.5" onClick={() => handleStatusChange(res.id, 'fulfilled')}>
                              <FaCheckCircle /> Fulfill
                            </button>
                            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1.5" onClick={() => handleStatusChange(res.id, 'cancelled')}>
                              <FaTimesCircle /> Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-5">No reservation records registered.</td>
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

export default Reservations;
