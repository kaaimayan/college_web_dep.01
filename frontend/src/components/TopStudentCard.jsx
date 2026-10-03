import React, { useState, useEffect } from 'react';
import { getTopBorrowers } from '../services/students';
import { useLibrary } from '../context/LibraryContext';
import { FaTrophy, FaMedal, FaCrown, FaUserGraduate, FaBookReader, FaStar } from 'react-icons/fa';
import { resolveAssetURL } from '../services/api';

const TopStudentCard = () => {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useLibrary();

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
  }, [refreshKey]);

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

      <div className="p-3 p-sm-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
        {/* Header Title */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="d-flex align-items-center gap-2 min-w-0">
            <div className="p-2 rounded-circle bg-warning bg-opacity-20 text-warning d-flex align-items-center justify-content-center flex-shrink-0">
              <FaCrown size={18} />
            </div>
            <div className="min-w-0">
              <h5 className="fw-bold mb-0 uppercase fs-6 fs-sm-5 text-truncate" style={{ letterSpacing: '0.5px' }}>
                TOP BORROWER RANKING
              </h5>
              <p className="text-secondary mb-0 fs-8 d-none d-sm-block">Recognizing our most avid reader &amp; book borrower</p>
            </div>
          </div>
          <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill fs-8 d-flex align-items-center gap-1 shadow-sm flex-shrink-0">
            <FaStar size={11} /> STAR READER
          </span>
        </div>

        {/* Highlighted #1 Top Student Card */}
        {topStudent && (
          <div 
            className="p-3 rounded-4 mb-3 position-relative"
            style={{ 
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
                <div className="position-relative flex-shrink-0">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center border border-2 border-warning shadow"
                    style={{ width: '54px', height: '54px', background: 'rgba(255, 255, 255, 0.95)', overflow: 'hidden' }}
                  >
                    {topStudent.photo ? (
                      <img src={resolveAssetURL(topStudent.photo)} alt={topStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FaUserGraduate size={26} className="text-warning" />
                    )}
                  </div>
                  <div 
                    className="position-absolute translate-middle-x bg-warning text-dark rounded-circle p-0.5 d-flex align-items-center justify-content-center shadow"
                    style={{ bottom: '-6px', left: '50%', width: '22px', height: '22px' }}
                  >
                    <FaTrophy size={11} />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="d-flex align-items-center gap-1.5 mb-0.5">
                    <span className="badge bg-gold-gradient text-dark fw-bold fs-9 px-1.5 py-0.5">RANK #1</span>
                    <span className="text-warning fw-bold fs-8">{topStudent.student_id}</span>
                  </div>
                  <h5 className="fw-bold mb-0 fs-6 fs-sm-5 text-truncate" style={{ maxWidth: '180px' }}>{topStudent.name}</h5>
                  <p className="text-secondary fs-8 mb-0 text-truncate" style={{ maxWidth: '180px' }}>
                    {topStudent.department} • Year {topStudent.year}
                  </p>
                </div>
              </div>

              <div className="ms-auto flex-shrink-0 text-end">
                <div className="bg-white bg-opacity-95 rounded-3 px-3 py-1.5 border border-warning border-opacity-40 text-center shadow-sm">
                  <div className="fs-4 fw-extrabold text-warning leading-none">
                    {topStudent.total_borrowed}
                  </div>
                  <div className="text-secondary fw-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.4px' }}>
                    Books Borrowed
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 5 Leaderboard List */}
        {topStudents.length > 1 && (
          <div>
            <h6 className="fw-semibold uppercase fs-8 mb-2 ms-1" style={{ letterSpacing: '0.8px' }}>
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
                      background: isGold ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.7)',
                      border: isGold ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--card-border)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="fw-bold fs-8 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '28px',
                          height: '28px',
                          background: isGold ? '#f59e0b' : isSilver ? '#94a3b8' : isBronze ? '#d97706' : 'rgba(37,99,235,0.1)',
                          color: isGold || isSilver || isBronze ? '#ffffff' : '#000000'
                        }}
                      >
                        {isGold ? <FaTrophy size={14} /> : isSilver ? <FaMedal size={14} /> : isBronze ? <FaMedal size={14} /> : `#${idx + 1}`}
                      </div>
                      <div>
                        <div className="fw-bold text-black fs-7">{student.name}</div>
                        <div className="text-secondary fs-9">{student.student_id} • {student.department}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-light text-dark border border-secondary px-2.5 py-1.5 fs-8 fw-semibold">
                        <FaBookReader className="me-1 text-primary" /> {student.total_borrowed} Books
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
