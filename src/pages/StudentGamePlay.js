import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  getStudentByUserId, 
  saveStudentProgress, 
  saveStudentAnswer,
  supabase
} from '../lib/supabase';
import PuzzleGamePlayer from '../components/PuzzleGamePlayer';
import MitosisCardGamePlayer from '../components/MitosisCardGamePlayer';
import './StudentGamePlay.css';

const StudentGamePlay = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, subject, gameData, studentId } = location.state || {};
  
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const [authenticatedStudent, setAuthenticatedStudent] = useState(null);
  const [progressSaved, setProgressSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if student is authenticated - redirect if not
  useEffect(() => {
    const checkStudentAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const { data: studentData } = await getStudentByUserId(currentUser.id);
          if (studentData) {
            setAuthenticatedStudent(studentData);
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
      setLoading(false);
    };

    checkStudentAuth();
  }, [navigate]);

  const handleGameComplete = async (results) => {
    setGameResults(results);
    setGameCompleted(true);

    // Save progress (student is always authenticated now)
    if (authenticatedStudent && !progressSaved) {
      await saveGameProgress(results);
    }
  };

  const saveGameProgress = async (results) => {
    try {
      // Create a unique session ID for this game attempt
      const sessionId = `${authenticatedStudent.id}_${gameData.id}_${Date.now()}`;
      
      // Calculate questions answered
      const totalQuestions = 3; // 2 multiple choice + 1 combined question
      let correctAnswers = 0;
      
      if (results.question1Correct) correctAnswers++;
      if (results.question2Correct) correctAnswers++;
      if (results.combinedQuestionCorrect) correctAnswers++;

      // Check if this is a puzzle game or quiz game
      const isPuzzleGame = gameData.game_type === 'puzzle' || gameData.image_url; // puzzle games have image_url
      
      let progressData;
      if (isPuzzleGame) {
        // Save progress for puzzle game
        progressData = {
          student_id: authenticatedStudent.id,
          subject_id: subject.id,
          puzzle_game_id: gameData.id,
          game_type: 'puzzle',
          score: results.score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_spent: results.timeTaken,
          session_id: sessionId
        };
        console.log('Saving puzzle game progress:', progressData);
      } else {
        // Try to find quiz level for traditional quiz games
        let levelId = null;
        const { data: levels } = await supabase
          .from('quiz_levels')
          .select('id')
          .eq('quiz_game_id', gameData.id)
          .limit(1);
        
        if (levels && levels.length > 0) {
          levelId = levels[0].id;
        }
        
        // Save progress for quiz game
        progressData = {
          student_id: authenticatedStudent.id,
          subject_id: subject.id,
          quiz_game_id: gameData.id,
          level_id: levelId,
          game_type: 'quiz',
          score: results.score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_spent: results.timeTaken,
          session_id: sessionId
        };
        console.log('Saving quiz game progress:', progressData);
      }

      console.log('Saving progress data:', progressData);

      const { data: savedProgress, error: progressError } = await saveStudentProgress(progressData);
      
      if (progressError) {
        console.error('Error saving progress:', progressError);
        alert(`Error saving progress: ${progressError.message}`);
        return;
      }
      
      if (savedProgress) {
        console.log('Progress saved successfully:', savedProgress);
        alert('🎉 Progress saved successfully! Your score has been recorded.');
      }

      // Save individual answers if progress was saved successfully (for quiz games only)
      if (savedProgress && savedProgress[0] && !isPuzzleGame) {
        const progressId = savedProgress[0].id;
        
        // Save answers for each question (only for quiz games with proper question_bank entries)
        const answers = [
          {
            progress_id: progressId,
            question_id: gameData.id, // Using game ID since we don't have separate question IDs
            student_answer: results.question1Correct ? 'Correct' : 'Incorrect',
            is_correct: results.question1Correct,
            time_taken: Math.floor(results.timeTaken / 3) // Approximate time per question
          },
          {
            progress_id: progressId,
            question_id: gameData.id,
            student_answer: results.question2Correct ? 'Correct' : 'Incorrect',
            is_correct: results.question2Correct,
            time_taken: Math.floor(results.timeTaken / 3)
          },
          {
            progress_id: progressId,
            question_id: gameData.id,
            student_answer: results.combinedQuestionCorrect ? 'MITOSIS' : 'MEIOSIS',
            is_correct: results.combinedQuestionCorrect,
            time_taken: Math.floor(results.timeTaken / 3)
          }
        ];

        // Save each answer
        for (const answer of answers) {
          await saveStudentAnswer(answer);
        }
      } else if (isPuzzleGame) {
        console.log('Skipping individual answer saving for puzzle game (not needed)');
      }

      setProgressSaved(true);
      console.log('Progress saved successfully');
      
    } catch (error) {
      console.error('Error saving game progress:', error);
    }
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    setGameResults(null);
    setProgressSaved(false);
    // This will force a re-render of the PuzzleGamePlayer component
    window.location.reload();
  };

  const handleBackToGames = () => {
    // Redirect to student dashboard (user is always authenticated now)
    navigate('/student/dashboard');
  };

  const handleBackToHome = () => {
    // Redirect to student dashboard (user is always authenticated now)
    navigate('/student/dashboard');
  };

  const handleQuitGame = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to quit the game? Your progress will be lost.')) {
      navigate('/student/dashboard');
    }
  };

  // Redirect if no game data
  if (!gameData || !studentName || !subject) {
    navigate('/student/auth');
    return null;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="student-game-play">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-game-play">
      {/* Game Results Modal */}
      {gameCompleted && gameResults && (
        <div className="results-overlay">
          <div className="results-modal">
            <div className="results-header">
              <h2>🎉 Game Complete!</h2>
              <p>Great job, {studentName}!</p>
              <div className="auth-status">
                <span className="auth-indicator">✅ Progress Saved to Your Account</span>
              </div>
            </div>
            
            <div className="results-content">
              <div className="score-display">
                <div className="final-score">
                  <span className="score-label">Final Score</span>
                  <span className="score-value">{gameResults.score}</span>
                </div>
                
                <div className="time-display">
                  <span className="time-label">Time Taken</span>
                  <span className="time-value">{gameResults.timeTaken}s</span>
                </div>
              </div>
              
              <div className="performance-summary">
                <h4>Performance Summary:</h4>
                <div className="summary-items">
                  <div className="summary-item">
                    <span className="summary-icon">🧩</span>
                    <span className="summary-text">Puzzles Completed</span>
                    <span className="summary-status">✅ {gameResults.totalPuzzles}/2</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">❓</span>
                    <span className="summary-text">Questions Correct</span>
                    <span className="summary-status">
                      ✅ {(gameResults.question1Correct ? 1 : 0) + 
                           (gameResults.question2Correct ? 1 : 0) + 
                           (gameResults.combinedQuestionCorrect ? 1 : 0) +
                           (gameResults.singleImageQuestionCorrect ? 1 : 0)}/4
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">🔓</span>
                    <span className="summary-text">Vocabulary Completed</span>
                    <span className="summary-status">
                      {gameResults.vocabularyCompleted ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">🧬</span>
                    <span className="summary-text">Mitosis Sorting</span>
                    <span className="summary-status">
                      {gameResults.mitosisSortingCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">⏰</span>
                    <span className="summary-text">Timeline Game</span>
                    <span className="summary-status">
                      {gameResults.timelineGameCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">🃏</span>
                    <span className="summary-text">Mitosis Card Game</span>
                    <span className="summary-status">
                      {gameResults.mitosisCardGameCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">✏️</span>
                    <span className="summary-text">Meiosis Fill-in-the-Blanks</span>
                    <span className="summary-status">
                      {gameResults.meiosisFillBlanksCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">🔄</span>
                    <span className="summary-text">Meiosis Drag & Drop</span>
                    <span className="summary-status">
                      {gameResults.meiosisDragDropCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">🔗</span>
                    <span className="summary-text">Venn Diagram</span>
                    <span className="summary-status">
                      {gameResults.vennDiagramCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">📝</span>
                    <span className="summary-text">Teacher Fill in the Blanks</span>
                    <span className="summary-status">
                      {gameResults.teacherFillBlanksCompleted ? '✅ Completed' : '❌ Not Completed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="score-breakdown">
                <h4>Score Breakdown:</h4>
                <div className="breakdown-items">
                  <div className="breakdown-item">
                    <span>🧩 Puzzle Completion</span>
                    <span>20 points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>❓ Question Answers</span>
                    <span>{(() => {
                      let points = 0;
                      if (gameResults.question1Correct) points += 10;
                      if (gameResults.question2Correct) points += 10;
                      if (gameResults.combinedQuestionCorrect) points += 5;
                      if (gameResults.singleImageQuestionCorrect) points += 5;
                      return `${points} points`;
                    })()}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>🔓 Vocabulary Matching</span>
                    <span>{gameResults.vocabularyMatchingScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>🧬 Mitosis Sorting</span>
                    <span>{gameResults.mitosisSortingScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>⏰ Timeline Game</span>
                    <span>{gameResults.timelineGameScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>🃏 Mitosis Card Game</span>
                    <span>{gameResults.mitosisCardGameScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>✏️ Meiosis Fill-in-the-Blanks</span>
                    <span>{gameResults.meiosisFillBlanksScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>🔄 Meiosis Drag & Drop</span>
                    <span>{gameResults.meiosisDragDropScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>🔗 Venn Diagram</span>
                    <span>{gameResults.vennDiagramScore || 0} points</span>
                  </div>
                  <div className="breakdown-item">
                    <span>📝 Teacher Fill in the Blanks</span>
                    <span>{gameResults.teacherFillBlanksScore || 0} points</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="results-actions">
              <button onClick={handlePlayAgain} className="play-again-btn">
                🔄 Play Again
              </button>
              <button onClick={handleBackToHome} className="home-btn-modal">
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Player */}
      {!gameCompleted && (
        <div className="game-player-container">
          {gameData.game_type === 'mitosis_card' ? (
            // Pass gameData to MitosisCardGamePlayer for real card data
            <MitosisCardGamePlayer onGameComplete={handleGameComplete} gameData={gameData} onQuitGame={handleQuitGame} />
          ) : (
            <PuzzleGamePlayer 
              gameData={gameData} 
              onGameComplete={handleGameComplete}
              onQuitGame={handleQuitGame}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentGamePlay; 