import React from 'react';

const Footer = () => {
  return (
    <footer className="w-100 text-center py-4 border-top border-secondary mt-5" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <p className="text-secondary mb-0 fs-7" style={{ letterSpacing: '0.8px' }}>
        KR Arts & Science College Library Management System &copy; {new Date().getFullYear()} | All Rights Reserved.
      </p>
      <p className="text-muted mb-0 fs-8 mt-1">
        Designed & Developed by V.KasiMayn III-year student of Bsc 'Computer Science'🎓<br />
           Contact: <a href="mailto:mayankasi464@gmail.com" className="text-decoration-underline">mayankasi464@gmail.com</a>
           github: <a href="https://github.com/kaaimayan" className="text-decoration-underline">kasimayan github</a>
      </p>
    </footer>
  );
};

export default Footer;
