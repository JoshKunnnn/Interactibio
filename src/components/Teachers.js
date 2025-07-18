import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Teachers.css';
import student1 from '../assets/images/student-1.jpg';
import student2 from '../assets/images/student-2.jpg';
import student3 from '../assets/images/student-3.jpg';

const Teachers = () => {
  const navigate = useNavigate();
  return (
    <section className="teachers">
      <div className="container">
        <div className="teachers-content">
          <div className="teachers-visuals">
            <div className="student-photos">
              <div className="student-photo student-1">
                <img src={student1} alt="Student 1" />
              </div>
              <div className="student-photo student-2">
                <img src={student2} alt="Student 2" />
              </div>
              <div className="student-photo student-3">
                <img src={student3} alt="Student 3" />
              </div>
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