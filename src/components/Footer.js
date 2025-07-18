import React, { useState } from 'react';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <div className="footer-cta">
              <h2 className="footer-title">
                Ready to InteractiBIO?
              </h2>
              <p className="footer-subtitle">
              Fun and interactive live worksheets built for today's learners.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo size="medium" className="footer-logo" />
              <p className="footer-description">
              Fun and interactive live worksheets built for today's learners.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">📘</a>
                <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">📷</a>
                <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">🐦</a>
                <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">💼</a>
              </div>
            </div>
            
            <div className="footer-links">
              <h3 className="footer-section-title">Quick Links</h3>
              <ul className="footer-link-list">
                <li><a href="/" className="footer-link">Home</a></li>
              </ul>
            </div>
            
            
            
            <div className="footer-newsletter">
              <h3 className="footer-section-title">Newsletter</h3>
              <p className="newsletter-description">
                Sign up for monthly activity ideas, new content alerts, and early access to learning packs.
              </p>
              <form onSubmit={handleSubmit} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 