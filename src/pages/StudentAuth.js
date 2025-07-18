import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInStudent, signUpStudent, insertStudent } from '../lib/supabase';
import './StudentAuth.css';

const StudentAuth = () => {
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
        const { error } = await signInStudent(formData.email, formData.password);
        if (error) throw error;
        navigate('/student/dashboard');
      } else {
        // Register
        const { data, error } = await signUpStudent(formData.email, formData.password, formData.fullName);
        if (error) throw error;
        
        // Create student profile
        if (data.user) {
          const { error: studentError } = await insertStudent({
            user_id: data.user.id,
            full_name: formData.fullName,
            email: formData.email
          });
          if (studentError) throw studentError;
        }
        
        navigate('/student/dashboard');
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
    <div className="student-auth">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>InteractiBIO</h1>
            <h2>{isLogin ? 'Student Login' : 'Create Student Account'}</h2>
            <p>Join the interactive biology learning experience!</p>
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
                  placeholder="Enter your full name"
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
                placeholder="Enter your email address"
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
                placeholder="Enter your password"
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

export default StudentAuth; 