import React, { useState, useEffect } from 'react';
import { getTeacherSubjects, deleteSubject } from '../lib/supabase';
import GameCreationModal from './GameCreationModal';
import './SubjectsList.css';

const SubjectsList = ({ teacherId, refreshTrigger, onEditSubject }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await getTeacherSubjects(teacherId);
      
      if (error) throw error;
      
      setSubjects(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      loadSubjects();
    }
  }, [teacherId, refreshTrigger]);

  const copyClassCode = (classCode) => {
    navigator.clipboard.writeText(classCode);
    // You could add a toast notification here
    alert(`Class code ${classCode} copied to clipboard!`);
  };

  const handleCreateGame = (subject) => {
    setSelectedSubject(subject);
    setShowGameModal(true);
  };

  const handleGameCreated = (gameData) => {
    console.log('Game created:', gameData);
    // TODO: Save game to database
    alert(`Puzzle game "${gameData.title}" created successfully!`);
    setShowGameModal(false);
  };

  const handleDeleteSubject = async (subject) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${subject.title}"?\n\nThis action cannot be undone and will permanently remove:\n• The subject and its class code (${subject.class_code})\n• All puzzle games created for this subject\n• All student progress data\n\nType "DELETE" to confirm.`
    );
    
    if (!confirmDelete) return;

    const confirmText = prompt(
      `To permanently delete "${subject.title}", please type "DELETE" (in capital letters):`
    );
    
    if (confirmText !== 'DELETE') {
      alert('Deletion cancelled. You must type "DELETE" exactly to confirm.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await deleteSubject(subject.id);
      
      if (error) throw error;
      
      // Remove the subject from local state
      setSubjects(subjects.filter(s => s.id !== subject.id));
      alert(`Subject "${subject.title}" has been permanently deleted.`);
    } catch (error) {
      alert(`Error deleting subject: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="subjects-loading">Loading subjects...</div>;
  }

  if (error) {
    return <div className="subjects-error">Error loading subjects: {error}</div>;
  }

  if (subjects.length === 0) {
    return (
      <div className="no-subjects">
        <div className="no-subjects-icon">📚</div>
        <h3>No Topics Yet</h3>
        <p>Create your first biology topic to get started!</p>
      </div>
    );
  }

  return (
    <div className="subjects-list">
      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div key={subject.id} className="subject-card">
            <div className="subject-header">
              <h3>{subject.title}</h3>
              <div className="subject-status">
                <span className={`status-badge ${subject.is_active ? 'active' : 'inactive'}`}>
                  {subject.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <p className="subject-description">
              {subject.description || 'No description provided'}
            </p>
            
            <div className="class-code-section">
              <div className="class-code-header">
                <span className="class-code-label">Class Code:</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyClassCode(subject.class_code)}
                  title="Copy class code"
                >
                  📋
                </button>
              </div>
              <div className="class-code">{subject.class_code}</div>
            </div>
            
            <div className="subject-meta">
              <small>Created: {new Date(subject.created_at).toLocaleDateString()}</small>
            </div>
            
            <div className="subject-actions">
              <button 
                className="btn-outline create-game-btn"
                onClick={() => handleCreateGame(subject)}
              >
                 Create Game
              </button>
              <button 
                className="btn-outline edit-btn"
                onClick={() => onEditSubject(subject)}
                title="Edit Topic"
              >
                Edit Topic
              </button>
              <button 
                className="btn-outline delete-btn"
                onClick={() => handleDeleteSubject(subject)}
                title="Delete Subject"
              >
                 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <GameCreationModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        subjectId={selectedSubject?.id}
        onGameCreated={handleGameCreated}
      />
    </div>
  );
};

export default SubjectsList; 