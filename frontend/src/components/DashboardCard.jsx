import React, { useRef, useState } from 'react';

const DashboardCard = ({ title, value, icon, color = 'var(--accent-gold)' }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Coordinates relative to card center
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    // Calculate rotation: maximum 10 degrees skew
    const rX = -(y / (height / 2)) * 8;
    const rY = (x / (width / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      ref={cardRef}
      className="glass-card stat-card h-100 d-flex flex-column justify-content-between"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="text-secondary fw-semibold text-uppercase fs-8 mb-2 d-block" style={{ letterSpacing: '1px' }}>
            {title}
          </span>
          <h2 className="fw-bold mb-0 text-black" style={{ fontSize: '32px' }}>
            {value}
          </h2>
        </div>
        <div 
          className="stat-icon-wrapper" 
          style={{ 
            background: `linear-gradient(135deg, ${color}, rgba(15, 23, 42, 0.8))`,
            color: color
          }}
        >
          {icon}
        </div>
      </div>
      
      {/* Small border bottom indicator for extra color coding */}
      <div style={{ height: '3px', background: color, borderRadius: '2px', width: '40%' }}></div>
    </div>
  );
};

export default DashboardCard;
