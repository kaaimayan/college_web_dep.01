import React, { useState, useEffect } from 'react';
import { getTopBorrowers } from '../services/students';
import { FaTrophy, FaMedal, FaCrown, FaUserGraduate, FaBookReader, FaStar } from 'react-icons/fa';

const TopStudentCard = () => {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const data = await getTopBorrowers(5);
        setTopStudents(data);
      } catch (err) {
        console.error('Failed to load top student ranking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-4 text-center text-secondary fs-7">
        <span className="spinner-border spinner-border-sm me-2 text-warning"></span>
        Loading Top Student Rankings...
      </div>
    );
  }

  if (!topStudents || topStudents.length === 0) {
    return null;
  }

  const topStudent = topStudents[0];

  return (
    <div className="glass-card position-relative overflow-hidden p-0 border-0 shadow-lg">
      {/* Background glowing particles */}
      <div 
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      ></div>

      <div className="p-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        {/* Header Title */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-circle bg-warning bg-opacity-20 text-warning d-flex align-items-center justify-content-center">
              <FaCrown size={20} />
            </div>
            <div>
              <h5 className="fw-bold text-white mb-0 uppercase" style={{ letterSpacing: '0.5px' }}>
                TOP BORROWER RANKING
              </h5>
              <p className="text-secondary mb-0 fs-8">Recognizing our most avid reader & book borrower</p>
            </div>
          </div>
          <span className="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill fs-8 d-flex align-items-center gap-1 shadow-sm">
            <FaStar /> STAR READER
          </span>
        </div>

        {/* Highlighted #1 Top Student Card */}
        {topStudent && (
          <div 
            className="p-3.5 rounded-4 mb-3 position-relative"
            style={{ 
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="row align-items-center g-3">
              <div className="col-auto position-relative">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center border border-2 border-warning shadow"
                  style={{ width: '64px', height: '64px', background: 'rgba(15, 23, 42, 0.8)', overflow: 'hidden' }}
                >
                  {topStudent.photo ? (
                    <img src={topStudent.photo} alt={topStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaUserGraduate size={30} className="text-warning" />
                  )}
                </div>
                <div 
                  className="position-absolute translate-middle-x bg-warning text-dark rounded-circle p-1 d-flex align-items-center justify-content-center shadow"
                  style={{ bottom: '-8px', left: '50%', width: '24px', height: '24px' }}
                >
                  <FaTrophy size={12} />
                </div>
              </div>

              <div className="col">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-gold-gradient text-dark fw-bold fs-9 px-2 py-0.5">RANK #1</span>
                  <span className="text-warning fw-bold fs-8">{topStudent.student_id}</span>
                </div>
                <h5 className="fw-bold text-white mb-1">{topStudent.name}</h5>
                <p className="text-secondary fs-8 mb-0">
                  {topStudent.department} • Year {topStudent.year}
                </p>
              </div>

              <div className="col-auto text-end">
                <div className="bg-dark bg-opacity-60 rounded-3 p-2 border border-warning border-opacity-20 text-center">
                  <div className="fs-4 fw-extrabold text-warning leading-none">
                    {topStudent.total_borrowed}
                  </div>
                  <div className="text-secondary fs-9 fw-semibold uppercase">Books Borrowed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 5 Leaderboard List */}
        {topStudents.length > 1 && (
          <div>
            <h6 className="text-secondary fw-semibold uppercase fs-8 mb-2 ms-1" style={{ letterSpacing: '0.8px' }}>
              LEADERBOARD TOP RANKINGS
            </h6>
            <div className="d-flex flex-column gap-2">
              {topStudents.map((student, idx) => {
                const isGold = idx === 0;
                const isSilver = idx === 1;
                const isBronze = idx === 2;

                return (
                  <div 
                    key={student.id} 
                    className="d-flex justify-content-between align-items-center p-2.5 rounded-3 transition-all"
                    style={{ 
                      background: isGold ? 'rgba(245, 158, 11, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                      border: isGold ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="fw-bold fs-8 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '28px',
                          height: '28px',
                          background: isGold ? '#f59e0b' : isSilver ? '#94a3b8' : isBronze ? '#d97706' : 'rgba(255,255,255,0.1)',
                          color: isGold || isSilver || isBronze ? '#0f172a' : '#94a3b8'
                        }}
                      >
                        {isGold ? <FaTrophy size={14} /> : isSilver ? <FaMedal size={14} /> : isBronze ? <FaMedal size={14} /> : `#${idx + 1}`}
                      </div>
                      <div>
                        <div className="fw-semibold text-white fs-7">{student.name}</div>
                        <div className="text-secondary fs-9">{student.student_id} • {student.department}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-dark text-warning border border-secondary px-2.5 py-1.5 fs-8 fw-semibold">
                        <FaBookReader className="me-1" /> {student.total_borrowed} Books
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopStudentCard;
