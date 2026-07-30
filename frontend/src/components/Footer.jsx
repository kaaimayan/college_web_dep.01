import React from 'react';
import { FaGithub, FaEnvelope, FaGraduationCap } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="clay-card mt-5 py-4 border-0" style={{ background: '#ffffff', borderRadius: '24px 24px 0 0' }}>
      <div className="container px-3">
        <div className="row align-items-center justify-content-between g-4">
          {/* College Branding and Copyright */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <h6 className="fw-bold mb-1" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.8px', color: '#1d4ed8' }}>
              KR Arts & Science College
            </h6>
            <p className="text-dark mb-0 fs-8" style={{ letterSpacing: '0.5px', color: '#000000' }}>
              Library Management System &copy; {new Date().getFullYear()} | All Rights Reserved.
            </p>
          </div>

          {/* Student Developer Info Section */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-flex flex-column align-items-center align-items-md-end gap-1.5">
              <span className="fs-7 fw-bold d-flex align-items-center gap-2 justify-content-center justify-content-md-end" style={{ color: '#000000' }}>
                <FaGraduationCap className="fs-5" style={{ color: '#1d4ed8' }} />
                Designed & Developed by <span style={{ color: '#1d4ed8' }}>V.KasiMayan</span>
              </span>
              <span className="fs-8 fw-medium" style={{ color: '#000000' }}>
                III-year student of B.Sc. Computer Science 🎓
              </span>

              {/* Email and GitHub Icon Buttons */}
              <div className="d-flex gap-2.5 justify-content-center justify-content-md-end mt-2">
                <a 
                  href="mailto:mayankasi464@gmail.com" 
                  className="btn btn-gold btn-sm d-flex align-items-center gap-2 py-1.5 px-3 fs-8 fw-bold"
                  title="Contact Developer via Email"
                  style={{ textDecoration: 'none' }}
                >
                  <FaEnvelope size={14} /> Email
                </a>
                <a 
                  href="https://github.com/kaaimayan" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline-gold btn-sm d-flex align-items-center gap-2 py-1.5 px-3 fs-8 fw-bold"
                  title="Visit Developer GitHub"
                  style={{ textDecoration: 'none' }}
                >
                  <FaGithub size={14} /> GitHub
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
