import React, { useState, useEffect } from 'react';
import { createSubject, updateSubject, getPuzzleGamesBySubject, deletePuzzleGame } from '../lib/supabase';
import GameCreationModal from './GameCreationModal';
import './SubjectModal.css';

const SubjectModal = ({ isOpen, onClose, teacherId, onSubjectCreated, editSubject = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('choice'); // 'choice', 'subject', 'games'
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const isEditMode = editSubject !== null;

  // Populate form when editing and reset step
  useEffect(() => {
    if (isEditMode && editSubject) {
      setFormData({
        title: editSubject.title || '',
        description: editSubject.description || ''
      });
      setCurrentStep('choice'); // Always start with choice for edit mode
    } else {
      setFormData({
        title: '',
        description: ''
      });
      setCurrentStep('subject'); // Go directly to subject creation for new subjects
    }
    setError('');
    setGames([]);
  }, [isEditMode, editSubject, isOpen]);

  // Generate a random class code
  const generateClassCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        // Update existing subject
        const subjectData = {
          title: formData.title,
          description: formData.description,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await updateSubject(editSubject.id, subjectData);
        
        if (error) throw error;
        
        // Show success message and ask if they want to manage games
        alert('Subject updated successfully!');
        
        // Ask if they want to manage games
        const manageGames = window.confirm('Would you like to manage games for this subject?');
        if (manageGames) {
          setCurrentStep('games');
          loadGames();
        } else {
          // Reset form and close modal
          setFormData({ title: '', description: '' });
          onSubjectCreated(data[0]); // This will trigger a refresh
          onClose();
        }
      } else {
        // Create new subject
        const classCode = generateClassCode();
        
        const subjectData = {
          teacher_id: teacherId,
          title: formData.title,
          description: formData.description,
          class_code: classCode,
          is_active: true
        };

        const { data, error } = await createSubject(subjectData);
        
        if (error) throw error;
        
        // Reset form and close modal
        setFormData({ title: '', description: '' });
        onSubjectCreated(data[0]);
        onClose();
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

  // Game management functions
  const loadGames = async () => {
    if (!editSubject) return;
    
    try {
      setGamesLoading(true);
      const { data, error } = await getPuzzleGamesBySubject(editSubject.id);
      
      if (error) throw error;
      
      setGames(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setGamesLoading(false);
    }
  };

  const handleCreateGame = () => {
    setEditGame(null);
    setShowGameModal(true);
  };

  const handleEditGame = (game) => {
    setEditGame(game);
    setShowGameModal(true);
  };

  const handleDeleteGame = async (game) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${game.title}"?\n\nThis action cannot be undone and will permanently remove:\n• The puzzle game\n• All student progress data for this game\n\nType "DELETE" to confirm.`
    );
    
    if (!confirmDelete) return;

    const confirmText = prompt(
      `To permanently delete "${game.title}", please type "DELETE" (in capital letters):`
    );
    
    if (confirmText !== 'DELETE') {
      alert('Deletion cancelled. You must type "DELETE" exactly to confirm.');
      return;
    }

    try {
      setGamesLoading(true);
      const { error } = await deletePuzzleGame(game.id);
      
      if (error) throw error;
      
      // Remove the game from local state
      setGames(games.filter(g => g.id !== game.id));
      alert(`Game "${game.title}" has been permanently deleted.`);
    } catch (error) {
      alert(`Error deleting game: ${error.message}`);
    } finally {
      setGamesLoading(false);
    }
  };

  const handleGameCreated = (gameData) => {
    // Refresh the games list
    loadGames();
    setShowGameModal(false);
    setEditGame(null);
    
    // Notify parent component
    onSubjectCreated(editSubject);
  };

  const handleCloseGameModal = () => {
    setShowGameModal(false);
    setEditGame(null);
  };

  const handleStepChange = (step) => {
    if (step === 'games') {
      loadGames();
    }
    setCurrentStep(step);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fullscreen-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isEditMode ? (
              currentStep === 'choice' ? 'Edit Topic' :
              currentStep === 'subject' ? 'Edit Topic Details' :
              'Manage Games'
            ) : 'Create New Topic'}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Step Navigation */}
        {isEditMode && (
          <div className="step-navigation">
            <button 
              className={`step-btn ${currentStep === 'choice' ? 'active' : ''}`}
              onClick={() => setCurrentStep('choice')}
            >
              Choose Action
            </button>
            <button 
              className={`step-btn ${currentStep === 'subject' ? 'active' : ''}`}
              onClick={() => setCurrentStep('subject')}
            >
              Topic Details
            </button>
            <button 
              className={`step-btn ${currentStep === 'games' ? 'active' : ''}`}
              onClick={() => handleStepChange('games')}
            >
              Manage Games
            </button>
          </div>
        )}

        {/* Choice Step - Only for edit mode */}
        {currentStep === 'choice' && isEditMode && (
          <div className="choice-step">
            <h3>What would you like to edit?</h3>
            <div className="choice-options">
              <div className="choice-card" onClick={() => setCurrentStep('subject')}>
                <div className="choice-icon">📝</div>
                <h4>Edit Topic Details</h4>
                <p>Change the title, description, or other topic information</p>
              </div>
              <div className="choice-card" onClick={() => handleStepChange('games')}>
                <div className="choice-icon">🎮</div>
                <h4>Manage Games</h4>
                <p>Create, edit, or delete puzzle games for this topic</p>
              </div>
            </div>
          </div>
        )}

        {/* Subject Details Step */}
        {currentStep === 'subject' && (
          <form onSubmit={handleSubmit} className="subject-form">
            <div className="form-group">
              <label>Topic Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Cell Biology, Human Anatomy, Genetics"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of what this topic covers..."
                rows="3"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              {isEditMode && (
                <button type="button" onClick={() => setCurrentStep('choice')} className="btn-secondary">
                  ← Back
                </button>
              )}
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Topic' : 'Create Topic')}
              </button>
            </div>

            {!isEditMode && (
              <div className="modal-info">
                <p>📝 A unique class code will be automatically generated for students to join this topic.</p>
              </div>
            )}
          </form>
        )}

        {/* Games Management Step */}
        {currentStep === 'games' && (
          <div className="games-management">
            <div className="games-header">
              <h3>Manage Games for "{editSubject?.title}"</h3>
              <button onClick={handleCreateGame} className="btn-primary">
                + Create New Game
              </button>
            </div>

            {gamesLoading && (
              <div className="loading-section">
                <div className="loading-spinner"></div>
                <p>Loading games...</p>
              </div>
            )}

            {!gamesLoading && (
              <div className="games-grid">
                {games.length === 0 ? (
                  <div className="no-games-message">
                    <div className="no-games-icon">🎮</div>
                    <h4>No Games Yet</h4>
                    <p>Create your first puzzle game to get started!</p>
                  </div>
                ) : (
                  games.map((game) => (
                    <div key={game.id} className="game-card">
                      <div className="game-images">
                        <div className="game-image">
                          <img src={game.image_url} alt={`${game.title} - Puzzle 1`} />
                          <span className="image-label">Puzzle 1</span>
                        </div>
                        <div className="game-image">
                          <img src={game.image_url_2} alt={`${game.title} - Puzzle 2`} />
                          <span className="image-label">Puzzle 2</span>
                        </div>
                      </div>
                      
                      <div className="game-info">
                        <h4>{game.title}</h4>
                        <p className="game-description">{game.description || 'No description'}</p>
                        <div className="game-details">
                          <span className="game-type">🧩 Puzzle Game</span>
                          <span className="game-difficulty">{game.difficulty || 'Medium'}</span>
                        </div>
                        <div className="game-meta">
                          <small>Created: {new Date(game.created_at).toLocaleDateString()}</small>
                          {game.updated_at !== game.created_at && (
                            <small>Updated: {new Date(game.updated_at).toLocaleDateString()}</small>
                          )}
                        </div>
                      </div>
                      
                      <div className="game-actions">
                        <button 
                          onClick={() => handleEditGame(game)}
                          className="btn-edit"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteGame(game)}
                          className="btn-delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="games-actions">
              <button onClick={() => setCurrentStep('choice')} className="btn-secondary">
                ← Back to Options
              </button>
              <button onClick={onClose} className="btn-secondary">
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <GameCreationModal
        isOpen={showGameModal}
        onClose={handleCloseGameModal}
        subjectId={editSubject?.id}
        onGameCreated={handleGameCreated}
        editGame={editGame}
      />
    </div>
  );
};

export default SubjectModal; 