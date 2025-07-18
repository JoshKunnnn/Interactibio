import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`logo-container ${size} ${className}`}>
      <div className="logo-icon">
        <img 
          src="/images/logo.png" 
          alt="INTERACTIBIO Logo" 
          className="logo-image"
        />
      </div>
    </div>
  );
};

export default Logo; 