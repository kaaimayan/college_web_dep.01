import React, { useState } from 'react';
import { FaSlidersH } from 'react-icons/fa';

const Settings = () => {
  const [fineRate, setFineRate] = useState('2.00');
  const [loanPeriod, setLoanPeriod] = useState('14');
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Library settings preserved successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="glass-card max-w-lg mx-auto">
      <h5 className="text-warning fw-bold mb-4 d-flex align-items-center gap-2">
        <FaSlidersH /> LIBRARY CONFIGURATIONS
      </h5>

      {success && <div className="alert alert-success bg-success bg-opacity-10 text-success border-0 fs-7">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-secondary fs-7 fw-semibold">COLLEGE ASSOCIATION (READ-ONLY)</label>
          <input
            type="text"
            className="form-control custom-input bg-opacity-10 text-muted"
            value="KR Arts And Science College"
            readOnly
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label text-secondary fs-7 fw-semibold">FINE PER OVERDUE DAY (₹)</label>
            <input
              type="number"
              step="0.50"
              className="form-control custom-input"
              value={fineRate}
              onChange={(e) => setFineRate(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label text-secondary fs-7 fw-semibold">STANDARD LOAN LIMIT (DAYS)</label>
            <input
              type="number"
              className="form-control custom-input"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label text-secondary fs-7 fw-semibold d-block">NOTIFICATION INTEGRATIONS</label>
          <div className="form-check form-switch mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="notifySwitch"
              checked={notifyOverdue}
              onChange={() => setNotifyOverdue(!notifyOverdue)}
              style={{ cursor: 'pointer' }}
            />
            <label className="form-check-label text-secondary fs-7" htmlFor="notifySwitch" style={{ cursor: 'pointer' }}>
              Auto-notify students about overdue due dates via email
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-gold w-100 py-2.5">
          SAVE CONSOLE SETTINGS
        </button>
      </form>
    </div>
  );
};

export default Settings;
