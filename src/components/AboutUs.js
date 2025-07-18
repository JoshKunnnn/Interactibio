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
                InteractiBIO harnesses the power of digital tools to make biology lessons more accessible, engaging, and aligned with 21st-century learning needs.
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
                Learners actively participate in lessons through click-based, drag-and-drop, and real-time exercises that reinforce understanding beyond traditional pen-paper assessment and passive reading.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-Time Feedbacking</h3>
              <p className="feature-desc">
                Students and teachers get immediate responses and insights, helping track progress, correct misunderstandings, and support timely learning interventions.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Eco-Friendly Learning</h3>
              <p className="feature-desc">
                As a fully digital platform, InteractiBIO eliminates the need for printed worksheets, reducing paper waste and supporting SDG 15: Life on Land by promoting sustainable, nature-friendly education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 