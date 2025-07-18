import React from 'react';
import './PlatformFeatures.css';

const PlatformFeatures = () => {
  const features = [
    {
      id: 1,
      icon: '🎮',
      title: 'Gamified',
      subtitle: 'Lessons',
      color: '#E91E63'
    },
    {
      id: 2,
      icon: '📊',
      title: 'Progress',
      subtitle: 'Tracking',
      color: '#00BCD4'
    },
    {
      id: 3,
      icon: '📥',
      title: 'Downloadable',
      subtitle: 'Resources',
      color: '#FF9800'
    },
    {
      id: 4,
      icon: '👥',
      title: 'Group',
      subtitle: 'Challenges',
      color: '#9C27B0'
    }
  ];

  return (
    <section className="platform-features section">
      <div className="container">
        <h2 className="section-title">
          What's Inside the Platform
        </h2>
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon-container" style={{ backgroundColor: feature.color }}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title" style={{ color: feature.color }}>
                  {feature.title}
                </h3>
                <p className="feature-subtitle">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="platform-video">
          <div className="video-placeholder">
            <div className="play-button">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="rgba(255, 255, 255, 0.9)"/>
                <path d="M23 20L40 30L23 40V20Z" fill="#8E44AD"/>
              </svg>
            </div>
          </div>
          <p className="video-description">
            For parents, home-friendly learning with no prep. For Teachers, Classroom-ready lessons and printable worksheets
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures; 