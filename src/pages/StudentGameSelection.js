import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getPuzzleGamesBySubject, getCurrentUser, getStudentByUserId } from '../lib/supabase';
import './StudentGameSelection.css';

const StudentGameSelection = () => {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, subject } = location.state || {};
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticatedStudent, setAuthenticatedStudent] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, [subjectId]);

  const checkAuthentication = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const { data: studentData } = await getStudentByUserId(currentUser.id);
        if (studentData) {
          setAuthenticatedStudent(studentData);
          loadGames();
        } else {
          navigate('/student/auth');
          return;
        }
      } else {
        navigate('/student/auth');
        return;
      }
    } catch (error) {
      console.log('Student not authenticated');
      navigate('/student/auth');
      return;
    }
  };

  const loadGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await getPuzzleGamesBySubject(subjectId);
      
      if (error) throw error;
      
      setGames(data || []);
    } catch (error) {
      setError('Failed to load games: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    navigate(`/play-game/${game.id}`, {
      state: {
        studentName: authenticatedStudent.full_name,
        subject,
        gameData: game,
        studentId: authenticatedStudent.id,
        studentEmail: authenticatedStudent.email
      }
    });
  };

  const handleBackToHome = () => {
    navigate('/student/dashboard');
  };

  if (!subject) {
    navigate('/student/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="student-game-selection">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-game-selection">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={handleBackToHome} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-game-selection">
      <div className="selection-container">
        {/* Header */}
        <div className="selection-header">
          <div className="student-info">
            <h1>Welcome, {authenticatedStudent?.full_name}! 👋</h1>
            <div className="subject-info">
              <h2>{subject.title}</h2>
              <p>{subject.description}</p>
            </div>
          </div>
          <button onClick={handleBackToHome} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        {/* Games List */}
        <div className="games-section">
          <h3>🧩 Available Puzzle Games</h3>
          
          {games.length === 0 ? (
            <div className="no-games">
              <div className="no-games-icon">🎮</div>
              <h4>No Games Available Yet</h4>
              <p>Your teacher hasn't created any puzzle games yet. Check back later!</p>
            </div>
          ) : (
            <div className="games-grid">
              {games.map((game) => (
                <div key={game.id} className="game-card">
                  <div className="game-image">
                    <img src={game.image_url} alt={game.title} />
                    <div className="game-type-badge">
                      {game.game_type === 'mitosis_card' ? 'Mitosis Card Game' : 'Puzzle Game'}
                    </div>
                    {game.image_url_2 && game.game_type !== 'mitosis_card' && (
                      <div className="dual-image-indicator">📸 2 Images</div>
                    )}
                  </div>
                  
                  <div className="game-content">
                    <h4>{game.title}</h4>
                    <p>{game.description || 'Complete the puzzle, answer questions, and learn!'}</p>
                    
                    <div className="game-instructions">
                      <small>{game.instructions}</small>
                    </div>
                  </div>
                  
                  <div className="game-actions">
                    <button 
                      onClick={() => handleGameSelect(game)}
                      className="play-btn"
                    >
                      {game.game_type === 'mitosis_card' ? '🃏 Play Card Game' : '🎮 Play Game'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentGameSelection; 