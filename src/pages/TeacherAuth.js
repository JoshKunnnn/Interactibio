import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, insertTeacher, copyCellDivisionTemplateForTeacher } from '../lib/supabase';
import './TeacherAuth.css';

const TeacherAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        navigate('/teacher/dashboard');
      } else {
        // Register
        const { data, error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) throw error;
        
        // Create teacher profile
        if (data.user) {
          const { data: teacherData, error: teacherError } = await insertTeacher({
            user_id: data.user.id,
            full_name: formData.fullName,
            email: formData.email
          });
          if (teacherError) throw teacherError;
          
          // Copy Cell Division template for the new teacher
          if (teacherData && teacherData[0]) {
            try {
              const { data: templateData, error: templateError } = await copyCellDivisionTemplateForTeacher(teacherData[0].id);
              if (templateError) {
                console.error('Error copying template:', templateError);
                // Don't throw error - template copying is optional
              } else {
                console.log('Cell Division template copied successfully for new teacher');
              }
            } catch (templateError) {
              console.error('Error copying template:', templateError);
              // Don't throw error - template copying is optional
            }
          }
        }
        
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="teacher-auth">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>InteractiBIO</h1>
            <h2>{isLogin ? 'Teacher Login' : 'Create Teacher Account'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="switch-btn"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="back-home">
            <button onClick={() => navigate('/')} className="btn-secondary">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAuth; 