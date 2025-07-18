import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Learners.css';
import learnersImage from '../assets/images/learners-studying.jpg';

const Learners = () => {
  const navigate = useNavigate();
  return (
    <section className="learners">
      <div className="container">
        <div className="learners-content">
          <div className="learners-text">
            <div className="learners-label">LEARNERS AND STUDENTS</div>
            <h2 className="learners-title">
              You can learn anything.
            </h2>
            <p className="learners-description">
            You can test your knowledge—your way.
            Practice biology the interactive way. Learning meets assessment in a fun, smart format.
            </p>
            <button className="btn-learners" onClick={() => navigate('/student/auth')}>Learners, start here</button>
          </div>
          <div className="learners-visuals">
            <div className="learners-image-container">
              <img src={learnersImage} alt="Students learning together with books and tablet" className="learners-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Learners; 