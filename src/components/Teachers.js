import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Teachers.css';

const Teachers = () => {
  const navigate = useNavigate();
  return (
    <section className="teachers">
      <div className="container">
        <div className="teachers-content">
          <div className="teachers-visuals">
            <div className="classroom-image">
              <img src="/images/stud1.png" alt="Interactive classroom with teacher and students" />
            </div>
          </div>
          <div className="teachers-text">
            <div className="teachers-label">TEACHERS</div>
            <h2 className="teachers-title">
            Interactive biology assessments made easy.
            </h2>
            <p className="teachers-description">Assess learning with ready-to-use, digital worksheets—no printing, no prep. Get real-time feedback with drag-and-drop, click-to-match, and more!
            </p>
            <button className="btn-teachers" onClick={() => navigate('/teacher/auth')}>Teachers, start here</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teachers; 