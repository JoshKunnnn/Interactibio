import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-us">
      <div className="container">
        <div className="about-content">
          <h2 className="about-title">Why InteractBIO?</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">💻</div>
              <h3 className="feature-title">Technology-Integrated</h3>
              <p className="feature-desc">
              Digital tools for engaging our type of learners today.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🧬</div>
              <h3 className="feature-title">Generation-Sensitive</h3>
              <p className="feature-desc">
                Designed with today's learners in mind, it uses modern formats, visuals, and language that match how Gen Z and Gen Alpha best absorb and interact with content.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Interactive Assessment</h3>
              <p className="feature-desc">
              Click, drag-and-drop, and real-time learning
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-Time Feedbacking</h3>
              <p className="feature-desc">
              Instant responses for progress tracking

              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Eco-Friendly Learning</h3>
              <p className="feature-desc">
              Paperless assessment platform supporting sustainable education
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 