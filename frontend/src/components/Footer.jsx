import React from 'react';
import { FaGithub, FaEnvelope, FaGraduationCap } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="glass-card mt-5 py-4 border-0 border-top border-primary border-3" style={{ background: 'var(--card-bg)', boxShadow: '0 -10px 25px rgba(37, 99, 235, 0.02)' }}>
      <div className="container px-2">
        <div className="row align-items-center justify-content-between g-3">
          {/* College Branding and Copyright */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <h6 className="fw-bold mb-1 text-primary" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.8px' }}>
              KR Arts & Science College
            </h6>
            <p className="text-secondary mb-0 fs-8" style={{ letterSpacing: '0.5px' }}>
              Library Management System &copy; {new Date().getFullYear()} | All Rights Reserved.
            </p>
          </div>

          {/* Student Developer Info Section */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-flex flex-column align-items-center align-items-md-end gap-1">
              <span className="fs-8 fw-semibold text-secondary d-flex align-items-center gap-2 justify-content-center justify-content-md-end">
                <FaGraduationCap className="text-primary fs-6" />
                Designed & Developed by V.KasiMayan
              </span>
              <span className="text-muted fs-9">
                III-year student of B.Sc. Computer Science 🎓
              </span>
              <div className="d-flex gap-2.5 justify-content-center justify-content-md-end mt-1.5">
                <a 
                  href="mailto:mayankasi464@gmail.com" 
                  className="btn btn-outline-gold rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px', border: '1px solid var(--accent-gold)' }}
                  title="Contact Developer via Email"
                >
                  <FaEnvelope size={13} />
                </a>
                <a 
                  href="https://github.com/kaaimayan" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline-gold rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px', border: '1px solid var(--accent-gold)' }}
                  title="Visit Developer GitHub"
                >
                  <FaGithub size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
