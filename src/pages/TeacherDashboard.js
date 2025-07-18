import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getTeacherByUserId, signOut } from '../lib/supabase';
import SubjectModal from '../components/SubjectModal';
import SubjectsList from '../components/SubjectsList';
import StudentMonitoring from '../components/StudentMonitoring';
import Logo from '../components/Logo';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/teacher/auth');
        return;
      }
      
      const { data: teacherData } = await getTeacherByUserId(currentUser.id);
      setTeacher(teacherData);
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/teacher/auth');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSubjectCreated = (newSubject) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateSubject = () => {
    setEditSubject(null);
    setShowSubjectModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditSubject(subject);
    setShowSubjectModal(true);
  };

  const handleCloseModal = () => {
    setShowSubjectModal(false);
    setEditSubject(null);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <Logo size="large" />
          <div className="nav-right">
            <span>Welcome, {teacher?.full_name}</span>
            <button onClick={handleSignOut} className="btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Student Monitoring Section (now below header) */}
      <StudentMonitoring teacherId={teacher?.id} />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header-section">
            <div>
              <h2>My Biology Topics</h2>
              <p>Create and manage your biology topics. Each topic gets a unique class code for students to join.</p>
            </div>
            <button 
              onClick={handleCreateSubject}
              className="btn-primary"
            >
              + Create New Topic
            </button>
          </div>

          <SubjectsList 
            teacherId={teacher?.id}
            refreshTrigger={refreshTrigger}
            onEditSubject={handleEditSubject}
          />
        </div>
      </main>

      <SubjectModal
        isOpen={showSubjectModal}
        onClose={handleCloseModal}
        teacherId={teacher?.id}
        onSubjectCreated={handleSubjectCreated}
        editSubject={editSubject}
      />
    </div>
  );
};

export default TeacherDashboard; 