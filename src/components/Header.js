import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleTeacherLoginClick = () => {
    navigate('/teacher/auth');
  };

  const handleStudentLoginClick = () => {
    navigate('/student/auth');
  };



  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Logo size="medium" />
          
          <div className="header-buttons">
            <div className="student-buttons">
              <button 
                onClick={handleStudentLoginClick}
                className="student-login-btn"
                title="Student login or create account"
              >
                Student Login
              </button>
            </div>
            <div className="teacher-buttons">
              <button 
                onClick={handleTeacherLoginClick}
                className="teacher-login-btn"
              >
                Teacher Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 