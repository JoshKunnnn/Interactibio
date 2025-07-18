import React, { useState, useEffect, useRef } from 'react';
import './PuzzleGamePlayer.css';
import MeiosisDragDropGame from './MeiosisDragDropGame';
import VennDiagramGame from './VennDiagramGame';
import VocabularyMatchingGame from './VocabularyMatchingGame';

import TeacherFillInTheBlanksGame from './TeacherFillInTheBlanksGame';

// Add MitosisCardGame component at the top of the file before PuzzleGamePlayer
function MitosisCardGame({ cards, onComplete }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [answer, setAnswer] = React.useState(null);
  const [feedbacks, setFeedbacks] = React.useState([]); // store feedback for all cards
  const [score, setScore] = React.useState(0);
  const [showSummary, setShowSummary] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);

  const currentCard = cards[currentIndex];

  const handleFlip = () => setFlipped(true);

  const handleAnswer = (ans) => {
    if (answer !== null) return;
    setAnswer(ans);
    const isCorrect = ans === currentCard.correctAnswer;
    setFeedbacks(fb => [...fb, isCorrect]);
    if (isCorrect) setScore(s => s + 5);
    setTimeout(() => {
      if (currentIndex + 1 >= cards.length) {
        setShowSummary(true);
        // Do NOT call onComplete yet; wait for Finish button
      } else {
        setCurrentIndex(i => i + 1);
        setFlipped(false);
        setAnswer(null);
      }
    }, 700); // short delay for feedback
  };

  const handleFinish = () => {
    onComplete(score);
  };

  if (showSummary) {
    const totalCorrect = feedbacks.filter(Boolean).length;
    return (
      <div className="review-stage">
        <div className="review-header">
          <h3>🃏 Mitosis Card Game Review</h3>
          <p>Let's review your answers for the mitosis card game.</p>
        </div>
        <div className="mitosis-score-summary">
          <h4>Your Score:</h4>
          <p>{totalCorrect} out of {cards.length} correct ({totalCorrect * 5} points)</p>
        </div>
        <div className="review-content">
          <div className="mitosis-card-review-grid">
            {cards.map((card, idx) => {
              const isCorrect = feedbacks[idx];
              return (
                <div key={idx} className="mitosis-card-review-item">
                  <img src={card.image_url} alt="Card" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '2px solid #eee', marginBottom: 12 }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#2d3748' }}>{card.question}</div>
                    <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                      Your answer: <strong>{card.correctAnswer === 'significant' ? 'Significant' : 'Not Significant'}</strong>
                      {typeof feedbacks[idx] !== 'undefined' && (
                        <span style={{ marginLeft: 8, color: isCorrect ? 'green' : 'red', fontWeight: 600 }}>
                          {isCorrect ? '✅' : '❌'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                      Correct answer: <strong>{card.correctAnswer === 'significant' ? 'Significant' : 'Not Significant'}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button className="mitosis-next-btn" onClick={handleFinish} style={{ marginTop: 24, padding: '10px 32px', borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 500, fontSize: 18, cursor: 'pointer' }}>
          Continue
        </button>
      </div>
    );
  }

  // Button positions for a 350x500px card (adjust if needed)
  const redBtnStyle = {
    position: 'absolute',
    left: 45,
    bottom: 55,
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    cursor: answer === null ? 'pointer' : 'default',
    zIndex: 3,
    outline: 'none',
    transition: 'box-shadow 0.2s',
  };
  const greenBtnStyle = {
    position: 'absolute',
    right: 45,
    bottom: 55,
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    cursor: answer === null ? 'pointer' : 'default',
    zIndex: 3,
    outline: 'none',
    transition: 'box-shadow 0.2s',
  };
  const hoverStyle = {
    boxShadow: '0 0 0 4px #14b8a6aa',
  };

  return (
    <div className="mitosis-card-game" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '600px' }}>
      <h3> Flip the Cards, Spot the Significance!
      </h3>
      <p style={{ 
        textAlign: 'center', 
        maxWidth: '600px', 
        margin: '0 20px 20px 20px', 
        lineHeight: '1.5',
        color: '#333',
        fontSize: '16px'
      }}>
        Direction: Click on each card to flip it and reveal an image. Once the card flips, decide if the image depicts the significance of mitosis. If it does, click the green option; if not, click the red option. Good luck and keep an eye on the details!
      </p>
      <div className="mitosis-card" style={{ width: 350, height: 500, position: 'relative', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
        {/* Always render the card background image */}
        <img
          src={require(`../assets/images/${flipped ? 'front.png' : 'back.png'}`)}
          alt={flipped ? 'Card front' : 'Card back'}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '24px', zIndex: 1, objectFit: 'cover' }}
        />
        {/* If not flipped, show a transparent overlay to make the card clickable */}
        {!flipped && (
          <div
            onClick={handleFlip}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'pointer', background: 'transparent' }}
            aria-label="Flip card"
          />
        )}
        {flipped && (
          <>
            <img
              src={currentCard.image_url}
              alt="Card"
              className="mitosis-card-overlay-img"
              style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', width: 220, height: 220, objectFit: 'cover', borderRadius: '12px', zIndex: 2, background: '#fff' }}
            />
            <div style={{ position: 'absolute', top: 270, left: 0, width: '100%', textAlign: 'center', fontWeight: 500, fontSize: 22, color: '#444', zIndex: 2 }}>
              {currentCard.question}
            </div>
            {/* Clickable button overlays */}
            <button
              style={hovered === 'red' ? { ...redBtnStyle, ...hoverStyle } : redBtnStyle}
              onMouseEnter={() => setHovered('red')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleAnswer('not significant')}
              disabled={answer !== null}
              aria-label="Not Significant"
            />
            <button
              style={hovered === 'green' ? { ...greenBtnStyle, ...hoverStyle } : greenBtnStyle}
              onMouseEnter={() => setHovered('green')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleAnswer('significant')}
              disabled={answer !== null}
              aria-label="Significant"
            />
          </>
        )}
      </div>
    </div>
  );
}

// Add MeiosisFillBlankGame component
function MeiosisFillBlankGame({ questions, onComplete }) {
  const [answers, setAnswers] = React.useState({});
  const [showReview, setShowReview] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [showReinforcement, setShowReinforcement] = React.useState(false);
  const [reinforcementMsg, setReinforcementMsg] = React.useState('');

  const handleAnswerSelect = (questionId, selectedAnswer, blankIndex = 0) => {
    setAnswers(prev => {
      if (blankIndex === 0 && !Array.isArray(questions.find(q => q.id === questionId)?.correct_answer)) {
        // For single blank questions, store the answer directly
        return {
          ...prev,
          [questionId]: selectedAnswer
        };
      } else {
        // For multiple blanks, store as object with blankIndex
        return {
          ...prev,
          [questionId]: {
            ...prev[questionId],
            [blankIndex]: selectedAnswer
          }
        };
      }
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (Array.isArray(question.correct_answer)) {
        // Handle multiple blanks (like question 8)
        const studentAnswers = answers[question.id] || {};
        const isCorrect = question.correct_answer.every((correct, index) => 
          studentAnswers[index] === correct
        );
        if (isCorrect) correctCount++;
      } else {
        // Handle single blank
        const studentAnswer = answers[question.id];
        if (studentAnswer === question.correct_answer) {
          correctCount++;
        }
      }
    });
    const finalScore = correctCount * 2; // 2 points per correct answer
    setScore(finalScore);
    // Calculate percent
    const percent = (correctCount / questions.length) * 100;
    if (percent >= 70) {
      setReinforcementMsg('Great job!');
    } else {
      setReinforcementMsg('Keep practicing! Remember the key points for each learning activity.');
    }
    setShowReinforcement(true);
    setTimeout(() => {
      setShowReinforcement(false);
      setShowReview(true);
    }, 2500);
  };

  const handleFinish = () => {
    onComplete(score, answers);
  };

  const allAnswered = questions.every(question => {
    if (Array.isArray(question.correct_answer)) {
      // For multiple blanks, check if all blanks are filled
      const studentAnswers = answers[question.id] || {};
      return question.correct_answer.every((_, index) => studentAnswers[index]);
    } else {
      // For single blank, check if answered (should be a string, not an object)
      return typeof answers[question.id] === 'string' && answers[question.id] !== '';
    }
  });

  if (showReview) {
    const correctCount = questions.filter(question => {
      if (Array.isArray(question.correct_answer)) {
        const studentAnswers = answers[question.id] || {};
        return question.correct_answer.every((correct, index) => 
          studentAnswers[index] === correct
        );
      } else {
        const studentAnswer = answers[question.id];
        return studentAnswer === question.correct_answer;
      }
    }).length;

    return (
      <div className="review-stage">
        <div className="review-header">
          <h3>🧬 Meiosis Fill-in-the-Blanks Review</h3>
          <p>Let's review your answers for the meiosis fill-in-the-blanks game.</p>
        </div>
        <div className="meiosis-score-summary">
          <h4>Your Score:</h4>
          <p>{correctCount} out of {questions.length} correct ({score} points)</p>
        </div>
        <div className="review-content">
          <div className="meiosis-review-questions">
            {questions.map((question) => {
              let studentAnswer, isCorrect;
              
              if (Array.isArray(question.correct_answer)) {
                // Handle multiple blanks
                const studentAnswers = answers[question.id] || {};
                studentAnswer = question.correct_answer.map((_, index) => 
                  studentAnswers[index] || 'No answer'
                ).join(' and ');
                isCorrect = question.correct_answer.every((correct, index) => 
                  studentAnswers[index] === correct
                );
              } else {
                // Handle single blank
                studentAnswer = answers[question.id] || 'No answer';
                isCorrect = studentAnswer === question.correct_answer;
              }
              
              return (
                <div key={question.id} className="meiosis-review-question">
                  <div className="question-text">
                    <strong>{question.id}.</strong> {question.question.replace(/___/g, () => {
                      if (Array.isArray(question.correct_answer)) {
                        // For multiple blanks, insert each answer in order
                        const studentAnswers = answers[question.id] || {};
                        return question.correct_answer.map((_, idx) => `"${studentAnswers[idx] || 'No answer'}"`).join(' ');
                      } else {
                        return `"${answers[question.id] || 'No answer'}"`;
                      }
                    })}
                  </div>
                  <div className="answer-feedback">
                    <div className={`student-answer ${isCorrect ? 'correct' : 'incorrect'}`}>Your answer: <strong>{Array.isArray(question.correct_answer) ? (question.correct_answer.map((_, idx) => answers[question.id]?.[idx] || 'No answer').join(' and ')) : studentAnswer}</strong><span className="feedback-icon">{isCorrect ? '✅' : '❌'}</span></div>
                    <div className="correct-answer">Correct answer: <strong>{Array.isArray(question.correct_answer) ? question.correct_answer.join(' and ') : question.correct_answer}</strong></div>
                    <div className="explanation">{question.explanation}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button className="meiosis-next-btn" onClick={handleFinish} style={{ marginTop: 24, padding: '10px 32px', borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 500, fontSize: 18, cursor: 'pointer' }}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="meiosis-fill-blank-game">
      {showReinforcement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '40px 48px',
            minWidth: 340,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 24,
            color: reinforcementMsg === 'Great job!' ? '#16a34a' : '#222',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}>
            <div>{reinforcementMsg}</div>
            <button
              style={{
                marginTop: 12,
                padding: '10px 32px',
                borderRadius: 8,
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #0001',
              }}
              onClick={() => {
                setShowReinforcement(false);
                setShowReview(true);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      <div className="stage-instructions">
        <h3>🧬 Unlocking the Secrets of Meiosis: Fill in the Blanks</h3>
        <p>Read each statement carefully and think about how meiosis contributes to genetic diversity and sexual reproduction. Click the correct words to fill in the blanks and complete each sentence.</p>
      </div>
      
      <div className="meiosis-questions-container">
        {questions.map((question) => (
          <div key={question.id} className="meiosis-question-item">
            <div className="question-text">
              <strong>{question.id}.</strong> {question.question}
            </div>
            <div className="answer-options">
              {Array.isArray(question.correct_answer) ? (
                // Handle multiple blanks (like question 8)
                <div className="multiple-blanks-row" style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                  <div className="blank-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="blank-label" style={{ marginBottom: 8, fontWeight: 500 }}>First blank:</span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {question.options.map((option) => (
                        <button
                          key={`${option}-0`}
                          className={`answer-option ${(answers[question.id]?.[0] === option) ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelect(question.id, option, 0)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="blank-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="blank-label" style={{ marginBottom: 8, fontWeight: 500 }}>Second blank:</span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {question.options.map((option) => (
                        <button
                          key={`${option}-1`}
                          className={`answer-option ${(answers[question.id]?.[1] === option) ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelect(question.id, option, 1)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Handle single blank
                question.options.map((option) => (
                  <button
                    key={option}
                    className={`answer-option ${answers[question.id] === option ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(question.id, option)}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="submit-area">
        <button 
          className="submit-meiosis-btn"
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
}




const PuzzleGamePlayer = ({ gameData, onGameComplete, onQuitGame }) => {
  const [gameState, setGameState] = useState('learning_screen'); // 'learning_screen', 'puzzle1', 'question1', 'question1_review', 'puzzle2', 'question2', 'question2_review', 'combined_question', 'combined_review', 'single_image_question', 'single_image_review', 'vocabulary', 'mitosis_learning_screen', 'mitosis_sorting', 'mitosis_review', 'timeline_learning_screen', 'timeline_game', 'timeline_review', 'mitosis_card_learning_screen', 'mitosis_card_game', 'meiosis_learning_screen', 'meiosis_fill_blank', 'meiosis_fill_blank_review', 'meiosis_drag_drop_learning_screen', 'meiosis_drag_drop', 'meiosis_drag_drop_review', 'venn_diagram_learning_screen', 'venn_diagram', 'venn_diagram_review', 'teacher_fill_blanks_learning_screen', 'teacher_fill_blanks', 'game_complete'
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [gridSlots, setGridSlots] = useState(Array(16).fill(null)); // 4x4 grid slots
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswer2, setSelectedAnswer2] = useState(null);
  const [combinedAnswer, setCombinedAnswer] = useState('');
  const [draggedCombinedOption, setDraggedCombinedOption] = useState(null);
  const [singleImageAnswer, setSingleImageAnswer] = useState('');
  const [draggedSingleImageOption, setDraggedSingleImageOption] = useState(null);
  const [mitosisMatches, setMitosisMatches] = useState({}); // { descriptionIndex: stageIndex }
  const [draggedMitosisDescription, setDraggedMitosisDescription] = useState(null);
  const [timelineSlots, setTimelineSlots] = useState(Array(5).fill(null)); // 5 timeline slots
  const [draggedTimelineImage, setDraggedTimelineImage] = useState(null);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoaded2, setImageLoaded2] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [debugMode, setDebugMode] = useState(false); // Add debug mode for testing
  const [debugDropdownMode, setDebugDropdownMode] = useState(false); // Add dropdown mode for debug
  const [selectedDebugGame, setSelectedDebugGame] = useState(''); // Selected game for debug dropdown
  const [meiosisAnswers, setMeiosisAnswers] = useState({}); // Add state for meiosis answers
  const [meiosisDragAnswers, setMeiosisDragAnswers] = useState({}); // Add state for meiosis drag answers
  const [vennDiagramAnswers, setVennDiagramAnswers] = useState({}); // Add state for venn diagram answers

  const [teacherFillBlanksAnswers, setTeacherFillBlanksAnswers] = useState({}); // Add state for teacher fill in the blanks answers
  const imageRef = useRef(null);
  const imageRef2 = useRef(null);
  const hasCalledOnGameComplete = useRef(false);



  // Initialize puzzle pieces when game starts
  useEffect(() => {
    if (gameData && (gameState === 'puzzle1' || gameState === 'puzzle2')) {
      initializePuzzle();
    }
  }, [gameData, gameState]);

  // Automatically call onGameComplete when Game Complete screen is rendered
  useEffect(() => {
    if (gameState === 'game_complete' && !hasCalledOnGameComplete.current) {
      hasCalledOnGameComplete.current = true;
      callOnGameComplete();
    }
  }, [gameState]);

  const initializePuzzle = () => {
    // Create 16 pieces (4x4 grid) with their image data
    const pieces = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        pieces.push({
          id: `piece-${row}-${col}`,
          correctPosition: row * 4 + col, // 0-15
          row: row,
          col: col,
          placed: false
        });
      }
    }
    
    // Shuffle the pieces for the side panel
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    setPuzzlePieces(shuffledPieces);
    setGridSlots(Array(16).fill(null)); // Reset grid
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const handleImageLoad2 = () => {
    setImageLoaded2(true);
  };

  const handleImageError2 = () => {
    setImageLoaded2(false);
  };



  // Debug functions for testing
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (debugMode) {
      setDebugDropdownMode(false);
      setSelectedDebugGame('');
    }
  };

  const toggleDebugDropdownMode = () => {
    setDebugDropdownMode(!debugDropdownMode);
  };

  const selectDebugGame = (gameState) => {
    setSelectedDebugGame(gameState);
    setGameState(gameState);
    setDebugDropdownMode(false);
  };

  const skipToNextStage = () => {
    if (gameState === 'learning_screen') {
      setGameState('puzzle1');
    } else if (gameState === 'puzzle1') {
      setScore(score + 10);
      setGameState('question1');
    } else if (gameState === 'question1') {
      setSelectedAnswer(0); // Auto-select first option
      setScore(score + 10);
      setGameState('question1_review');
    } else if (gameState === 'question1_review') {
      setGameState('puzzle2');
    } else if (gameState === 'puzzle2') {
      setScore(score + 10);
      setGameState('question2');
    } else if (gameState === 'question2') {
      setSelectedAnswer2(0); // Auto-select first option
      setScore(score + 10);
      setGameState('question2_review');
    } else if (gameState === 'question2_review') {
      setGameState('combined_question');
    } else if (gameState === 'combined_question') {
      setCombinedAnswer('MITOSIS'); // Correct answer for debug mode
      setScore(score + 5);
      setGameState('combined_review');
    } else if (gameState === 'combined_review') {
      setGameState('single_image_question');
    } else if (gameState === 'single_image_question') {
      setSingleImageAnswer(gameData.single_question_correct_answer || 'MEIOSIS'); // Use correct answer or default
      setScore(score + 5);
      setGameState('single_image_review');
    } else if (gameState === 'single_image_review') {
      setGameState('vocabulary');
    } else if (gameState === 'vocabulary') {
      setGameState('mitosis_learning_screen');
    } else if (gameState === 'mitosis_learning_screen') {
      setGameState('mitosis_sorting');
    } else if (gameState === 'mitosis_sorting') {
      setScore(score + 10);
      setGameState('mitosis_review');
    } else if (gameState === 'mitosis_review') {
      setGameState('timeline_learning_screen');
    } else if (gameState === 'timeline_learning_screen') {
      setGameState('timeline_game');
    } else if (gameState === 'timeline_game') {
      setGameState('timeline_review');
    } else if (gameState === 'timeline_review') {
      setGameState('mitosis_card_learning_screen');
    } else if (gameState === 'mitosis_card_learning_screen') {
      setGameState('mitosis_card_game');
    } else if (gameState === 'mitosis_card_game') {
      setGameState('meiosis_learning_screen');
    } else if (gameState === 'meiosis_learning_screen') {
      setGameState('meiosis_fill_blank');
    } else if (gameState === 'meiosis_fill_blank') {
      setGameState('meiosis_fill_blank_review');
    } else if (gameState === 'meiosis_fill_blank_review') {
      setGameState('meiosis_drag_drop_learning_screen');
    } else if (gameState === 'meiosis_drag_drop_learning_screen') {
      setGameState('meiosis_drag_drop');
    } else if (gameState === 'meiosis_drag_drop') {
      setGameState('venn_diagram_learning_screen');
    } else if (gameState === 'venn_diagram_learning_screen') {
      setGameState('venn_diagram');
    } else if (gameState === 'venn_diagram') {
      setGameState('teacher_fill_blanks_learning_screen');
    } else if (gameState === 'teacher_fill_blanks_learning_screen') {
      setGameState('teacher_fill_blanks');
    } else if (gameState === 'teacher_fill_blanks') {
      setGameState('game_complete');
    }
  };

  // Keyboard shortcut for debug mode (Ctrl+D)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDebugMode();
      }
      if (debugMode && e.key === 's' && !e.ctrlKey) {
        e.preventDefault();
        skipToNextStage();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [debugMode, gameState, score]);

  // Combined Question handlers
  const handleCombinedDragStart = (e, option) => {
    setDraggedCombinedOption(option);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCombinedDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCombinedDrop = (e) => {
    e.preventDefault();
    if (draggedCombinedOption) {
      setCombinedAnswer(draggedCombinedOption);
      setDraggedCombinedOption(null);
    }
  };

  const handleCombinedDragEnd = () => {
    setDraggedCombinedOption(null);
  };

  const submitCombinedAnswer = () => {
    // The correct answer is always MITOSIS
    const isCorrect = combinedAnswer === 'MITOSIS';
    
    if (isCorrect) {
      setScore(score + 5);
    }
    
    // Move to combined review stage
    setGameState('combined_review');
  };

  // Continue functions for review stages
  const continueFromQuestion1Review = () => {
    setGameState('puzzle2');
  };

  const continueFromQuestion2Review = () => {
    setGameState('combined_question');
  };

  const continueFromCombinedReview = () => {
    setGameState('single_image_question');
  };

  const continueFromSingleImageReview = () => {
    setGameState('vocabulary');
  };

  const continueFromVocabulary = () => {
    setGameState('mitosis_learning_screen');
  };

  const clearCombinedAnswer = () => {
    setCombinedAnswer('');
  };

  // Single Image Question handlers
  const handleSingleImageDragStart = (e, option) => {
    setDraggedSingleImageOption(option);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSingleImageDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSingleImageDrop = (e) => {
    e.preventDefault();
    if (draggedSingleImageOption) {
      setSingleImageAnswer(draggedSingleImageOption);
      setDraggedSingleImageOption(null);
    }
  };

  const handleSingleImageDragEnd = () => {
    setDraggedSingleImageOption(null);
  };

  const submitSingleImageAnswer = () => {
    const isCorrect = singleImageAnswer === gameData.single_question_correct_answer;
    
    if (isCorrect) {
      setScore(score + 5);
    }
    
    // Move to single image review stage
    setGameState('single_image_review');
  };

  const clearSingleImageAnswer = () => {
    setSingleImageAnswer('');
  };

  // Mitosis Sorting Game handlers
  const handleMitosisDragStart = (e, descriptionIndex) => {
    setDraggedMitosisDescription(descriptionIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleMitosisDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleMitosisDrop = (e, stageIndex) => {
    e.preventDefault();
    if (draggedMitosisDescription !== null) {
      setMitosisMatches(prev => ({
        ...prev,
        [draggedMitosisDescription]: stageIndex
      }));
      setDraggedMitosisDescription(null);
    }
  };

  const handleMitosisDragEnd = () => {
    setDraggedMitosisDescription(null);
  };

  const removeMitosisDescription = (descriptionIndex) => {
    setMitosisMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[descriptionIndex];
      return newMatches;
    });
  };

  // Timeline Game handlers
  const handleTimelineDragStart = (e, imageIndex) => {
    setDraggedTimelineImage(imageIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTimelineDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleTimelineDrop = (e, slotIndex) => {
    e.preventDefault();
    if (draggedTimelineImage !== null) {
      const newSlots = [...timelineSlots];
      newSlots[slotIndex] = draggedTimelineImage;
      setTimelineSlots(newSlots);
      setDraggedTimelineImage(null);
    }
  };

  const handleTimelineDragEnd = () => {
    setDraggedTimelineImage(null);
  };

  const removeTimelineImage = (slotIndex) => {
    const newSlots = [...timelineSlots];
    newSlots[slotIndex] = null;
    setTimelineSlots(newSlots);
  };

  const submitTimelineGame = () => {
    // Calculate score based on correct positions
    let correctPositions = 0;
    const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
    
    timelineSlots.forEach((imageIndex, slotIndex) => {
      if (imageIndex !== null && correctOrder[slotIndex] === imageIndex + 1) {
        correctPositions++;
      }
    });
    
    setScore(score + (correctPositions * 2)); // 2 points per correct position
    setGameState('timeline_review');
  };

  const continueFromTimelineReview = () => {
    setGameState('mitosis_card_learning_screen');
  };

  const submitMitosisSorting = () => {
    // Calculate score based on correct matches
    let correctMatches = 0;
    const correctMatchesData = gameData.mitosis_correct_matches || {};
    
    Object.keys(mitosisMatches).forEach(descriptionIndex => {
      if (mitosisMatches[descriptionIndex] === correctMatchesData[descriptionIndex]) {
        correctMatches++;
      }
    });
    
    setScore(score + correctMatches);
    setGameState('mitosis_review');
  };

  const continueFromMitosisReview = () => {
    setGameState('timeline_learning_screen');
  };

  // Drag and Drop handlers
  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    if (!draggedPiece) return;

    // Check if this is the correct position for the piece
    if (draggedPiece.correctPosition === slotIndex) {
      // Correct placement
      const newGridSlots = [...gridSlots];
      const newPuzzlePieces = puzzlePieces.map(piece => 
        piece.id === draggedPiece.id ? { ...piece, placed: true } : piece
      );

      newGridSlots[slotIndex] = draggedPiece;
      setGridSlots(newGridSlots);
      setPuzzlePieces(newPuzzlePieces);

      // Check if puzzle is complete
      const completedPieces = newGridSlots.filter(slot => slot !== null).length;
      if (completedPieces === 16) {
        setScore(score + 10);
        // Move to appropriate question based on current puzzle
        if (gameState === 'puzzle1') {
          setTimeout(() => setGameState('question1'), 1000);
        } else if (gameState === 'puzzle2') {
          setTimeout(() => setGameState('question2'), 1000);
        }
      }
    } else {
      // Wrong placement - piece bounces back
      const pieceElement = document.querySelector(`[data-piece-id="${draggedPiece.id}"]`);
      if (pieceElement) {
        pieceElement.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
          pieceElement.style.animation = '';
        }, 500);
      }
    }

    setDraggedPiece(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  // Remove piece from grid (double-click to remove)
  const handleSlotDoubleClick = (slotIndex) => {
    const piece = gridSlots[slotIndex];
    if (piece) {
      const newGridSlots = [...gridSlots];
      const newPuzzlePieces = puzzlePieces.map(p => 
        p.id === piece.id ? { ...p, placed: false } : p
      );
      
      newGridSlots[slotIndex] = null;
      setGridSlots(newGridSlots);
      setPuzzlePieces(newPuzzlePieces);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (gameState === 'question1') {
      setSelectedAnswer(answerIndex);
    } else if (gameState === 'question2') {
      setSelectedAnswer2(answerIndex);
    }
  };

  const submitAnswer = () => {
    if (gameState === 'question1') {
      const isCorrect = selectedAnswer === gameData.correct_answer_index;
      if (isCorrect) {
        setScore(score + 10);
      }
      // Move to question 1 review
      setGameState('question1_review');
    } else if (gameState === 'question2') {
      const isCorrect = selectedAnswer2 === gameData.correct_answer_index_2;
      if (isCorrect) {
        setScore(score + 10);
      }
      // Move to question 2 review
      setGameState('question2_review');
    }
  };

  const handleVocabularyComplete = (vocabularyScore) => {
    setScore(score + vocabularyScore);
    setGameState('mitosis_sorting');
  };

  const calculateFinalScore = () => {
    let finalScore = 0;
    
    // Puzzle completion points (20 points)
    finalScore += 20;
    
    // Question answers points
    if (selectedAnswer === gameData.correct_answer_index) finalScore += 10;
    if (selectedAnswer2 === gameData.correct_answer_index_2) finalScore += 10;
    if (combinedAnswer === 'MITOSIS') finalScore += 5;
    if (singleImageAnswer === gameData.single_question_correct_answer) finalScore += 5;
    
    // Mitosis sorting points
    const correctMatchesData = gameData.mitosis_correct_matches || {};
    Object.keys(mitosisMatches).forEach(descriptionIndex => {
      if (mitosisMatches[descriptionIndex] === correctMatchesData[descriptionIndex]) {
        finalScore += 1;
      }
    });
    
    // Timeline game points
    const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
    timelineSlots.forEach((imageIndex, slotIndex) => {
      if (imageIndex !== null && correctOrder[slotIndex] === imageIndex + 1) {
        finalScore += 2;
      }
    });
    
    // Vocabulary matching points (already added to score)
    // This is already included in the current score
    
    // Meiosis fill blanks points
    const meiosisQuestions = gameData.meiosis_fill_blank_questions || [];
    meiosisQuestions.forEach(q => {
      const studentAnswer = meiosisAnswers[q.id];
      if (Array.isArray(q.correct_answer)) {
        if (Array.isArray(studentAnswer) || typeof studentAnswer === 'object') {
          const arr = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer[0], studentAnswer[1]];
          if (q.correct_answer.every((ans, idx) => arr[idx] === ans)) {
            finalScore += 2;
          }
        }
      } else {
        if (studentAnswer === q.correct_answer) {
          finalScore += 2;
        }
      }
    });
    
    // Meiosis drag drop points
    const correctMappings = {
      "interphase": "Chromatin duplicated",
      "prophase1": "Crossing over occurs",
      "prophase1_spindle": "Spindle fibers start to reach out to centromeres of homologous chromosomes",
      "metaphase1": "Homologous chromosomes line up at the equator",
      "anaphase1": "Homologous chromosomes are pulled apart to opposite poles of the cell",
      "telophase1_cytoplasm": "Cytoplasm divides amongst daughter cells",
      "telophase1_cells": "Two daughter cells are created",
      "prophase2": "Spindle fibers start to reach out to centromeres of sister chromatids",
      "metaphase2": "Sister chromatids line up along the equator",
      "anaphase2_separate": "Sister chromatids separate",
      "anaphase2_move": "Sister chromatids move to opposite poles",
      "telophase2": "Daughter cells divide, forming 4 haploid cells"
    };
    Object.keys(correctMappings).forEach(phaseId => {
      if (meiosisDragAnswers[phaseId] === correctMappings[phaseId]) {
        finalScore += 2;
      }
    });
    
    // Venn diagram points
    const descriptions = gameData?.venn_diagram_descriptions || [];
    const correctPlacements = gameData?.venn_diagram_correct_placements || {};
    descriptions.forEach((_, index) => {
      const correctSection = correctPlacements[index.toString()];
      const studentSection = vennDiagramAnswers[correctSection];
      if (studentSection && studentSection.includes(index)) {
        finalScore += 2;
      }
    });
    
    // Teacher fill blanks points
    const teacherQuestions = gameData?.teacher_fill_blanks_questions || [];
    teacherQuestions.forEach((question, questionIndex) => {
      const questionAnswers = teacherFillBlanksAnswers[questionIndex] || [];
      question.blanks.forEach((blank, blankIndex) => {
        const userAnswer = questionAnswers[blankIndex] || '';
        if (userAnswer.toLowerCase().trim() === blank.answer.toLowerCase().trim()) {
          finalScore += 5;
        }
      });
    });
    
    return finalScore;
  };

  const handleContinueToSummary = () => {
    // This function is now just for navigation
    // The actual onGameComplete call happens automatically when the screen renders
    console.log('Navigating to final summary...');
  };

  // Function to call onGameComplete with complete final data
  const callOnGameComplete = () => {
    // Calculate final complete score with all games
    const finalScore = calculateFinalScore();
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate individual game scores
    const puzzleCompletionScore = 20; // Fixed 20 points for completing both puzzles
    
    const questionAnswersScore = (() => {
      let score = 0;
      if (selectedAnswer === gameData.correct_answer_index) score += 10;
      if (selectedAnswer2 === gameData.correct_answer_index_2) score += 10;
      if (combinedAnswer === 'MITOSIS') score += 5;
      if (singleImageAnswer === gameData.single_question_correct_answer) score += 5;
      return score;
    })();
    
    const vocabularyMatchingScore = (() => {
      // Since vocabulary score is already included in the total score,
      // we'll calculate it as the remaining score after other games
      // This is a reasonable approach since vocabulary is completed
      return 0; // Will be calculated after other scores are determined
    })();
    
    const mitosisSortingScore = (() => {
      let correctMatches = 0;
      const correctMatchesData = gameData.mitosis_correct_matches || {};
      Object.keys(mitosisMatches).forEach(descriptionIndex => {
        if (mitosisMatches[descriptionIndex] === correctMatchesData[descriptionIndex]) {
          correctMatches++;
        }
      });
      return correctMatches;
    })();
    
    const timelineGameScore = (() => {
      let correctPositions = 0;
      const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
      timelineSlots.forEach((imageIndex, slotIndex) => {
        if (imageIndex !== null && correctOrder[slotIndex] === imageIndex + 1) {
          correctPositions++;
        }
      });
      return correctPositions * 2;
    })();
    
    const mitosisCardGameScore = 0; // Placeholder - would need to track this
    
    const meiosisFillBlanksScore = (() => {
      const questions = gameData.meiosis_fill_blank_questions || [];
      let correctAnswers = 0;
      questions.forEach(q => {
        const studentAnswer = meiosisAnswers[q.id];
        if (Array.isArray(q.correct_answer)) {
          if (Array.isArray(studentAnswer) || typeof studentAnswer === 'object') {
            const arr = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer[0], studentAnswer[1]];
            if (q.correct_answer.every((ans, idx) => arr[idx] === ans)) {
              correctAnswers++;
            }
          }
        } else {
          if (studentAnswer === q.correct_answer) {
            correctAnswers++;
          }
        }
      });
      return correctAnswers * 2;
    })();
    
    const meiosisDragDropScore = (() => {
      const correctMappings = {
        "interphase": "Chromatin duplicated",
        "prophase1": "Crossing over occurs",
        "prophase1_spindle": "Spindle fibers start to reach out to centromeres of homologous chromosomes",
        "metaphase1": "Homologous chromosomes line up at the equator",
        "anaphase1": "Homologous chromosomes are pulled apart to opposite poles of the cell",
        "telophase1_cytoplasm": "Cytoplasm divides amongst daughter cells",
        "telophase1_cells": "Two daughter cells are created",
        "prophase2": "Spindle fibers start to reach out to centromeres of sister chromatids",
        "metaphase2": "Sister chromatids line up along the equator",
        "anaphase2_separate": "Sister chromatids separate",
        "anaphase2_move": "Sister chromatids move to opposite poles",
        "telophase2": "Daughter cells divide, forming 4 haploid cells"
      };
      let correctAnswers = 0;
      Object.keys(correctMappings).forEach(phaseId => {
        if (meiosisDragAnswers[phaseId] === correctMappings[phaseId]) {
          correctAnswers++;
        }
      });
      return correctAnswers * 2;
    })();
    
    const vennDiagramScore = (() => {
      const descriptions = gameData?.venn_diagram_descriptions || [];
      const correctPlacements = gameData?.venn_diagram_correct_placements || {};
      let correctAnswers = 0;
      descriptions.forEach((_, index) => {
        const correctSection = correctPlacements[index.toString()];
        const studentSection = vennDiagramAnswers[correctSection];
        if (studentSection && studentSection.includes(index)) {
          correctAnswers++;
        }
      });
      return correctAnswers * 2;
    })();
    
    const teacherFillBlanksScore = (() => {
      const questions = gameData?.teacher_fill_blanks_questions || [];
      let correctAnswers = 0;
      questions.forEach((question, questionIndex) => {
        const questionAnswers = teacherFillBlanksAnswers[questionIndex] || [];
        question.blanks.forEach((blank, blankIndex) => {
          const userAnswer = questionAnswers[blankIndex] || '';
          if (userAnswer.toLowerCase().trim() === blank.answer.toLowerCase().trim()) {
            correctAnswers++;
          }
        });
      });
      return correctAnswers * 5;
    })();
    
    // Calculate vocabulary score as the remaining score after other games
    const calculatedVocabularyScore = Math.max(0, finalScore - puzzleCompletionScore - questionAnswersScore - mitosisSortingScore - timelineGameScore - meiosisFillBlanksScore - meiosisDragDropScore - vennDiagramScore - teacherFillBlanksScore);
    
    // Call onGameComplete with complete final data
    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        timeTaken: timeTaken,
        completed: true,
        
        // Individual game correctness
        question1Correct: selectedAnswer === gameData.correct_answer_index,
        question2Correct: selectedAnswer2 === gameData.correct_answer_index_2,
        combinedQuestionCorrect: combinedAnswer === 'MITOSIS',
        singleImageQuestionCorrect: singleImageAnswer === gameData.single_question_correct_answer,
        mitosisCorrectMatches: mitosisSortingScore,
        timelineCorrectPositions: timelineGameScore / 2, // Convert back to count
        vocabularyCompleted: true,
        totalPuzzles: 2,
        
        // Individual game scores
        puzzleCompletionScore: puzzleCompletionScore,
        questionAnswersScore: questionAnswersScore,
        vocabularyMatchingScore: calculatedVocabularyScore,
        mitosisSortingScore: mitosisSortingScore,
        timelineGameScore: timelineGameScore,
        mitosisCardGameScore: mitosisCardGameScore,
        meiosisFillBlanksScore: meiosisFillBlanksScore,
        meiosisDragDropScore: meiosisDragDropScore,
        vennDiagramScore: vennDiagramScore,
        teacherFillBlanksScore: teacherFillBlanksScore,
        
        // Game completion status
        puzzleCompleted: true,
        questionsCompleted: true,
        vocabularyCompleted: true,
        mitosisSortingCompleted: true,
        timelineGameCompleted: true,
        mitosisCardGameCompleted: true,
        meiosisFillBlanksCompleted: true,
        meiosisDragDropCompleted: true,
        vennDiagramCompleted: true,
        teacherFillBlanksCompleted: true,
        
        // Answer data for detailed analysis
        selectedAnswer: selectedAnswer,
        selectedAnswer2: selectedAnswer2,
        combinedAnswer: combinedAnswer,
        singleImageAnswer: singleImageAnswer,
        mitosisMatches: mitosisMatches,
        timelineSlots: timelineSlots,
        meiosisAnswers: meiosisAnswers,
        meiosisDragAnswers: meiosisDragAnswers,
        vennDiagramAnswers: vennDiagramAnswers,
        teacherFillBlanksAnswers: teacherFillBlanksAnswers
      });
    }
  };

  // Render individual puzzle piece
  const renderPuzzlePiece = (piece) => {
    const isSecondPuzzle = gameState === 'puzzle2';
    const currentImageLoaded = isSecondPuzzle ? imageLoaded2 : imageLoaded;
    const currentImageUrl = isSecondPuzzle ? gameData.image_url_2 : gameData.image_url;
    
    if (!currentImageLoaded) {
      // Fallback colored piece (no numbers)
      return (
        <div 
          className="puzzle-piece fallback-piece"
          style={{ 
            backgroundColor: `hsl(${(piece.row * 4 + piece.col) * 25}, 60%, 70%)`
          }}
        />
      );
    }

    // Calculate the background position for this piece
    const pieceWidth = 100; // Each piece is 100px wide
    const pieceHeight = 100; // Each piece is 100px tall
    const backgroundX = -piece.col * pieceWidth;
    const backgroundY = -piece.row * pieceHeight;

    return (
      <div 
        className="puzzle-piece image-piece"
        style={{
          backgroundImage: `url(${currentImageUrl})`,
          backgroundPosition: `${backgroundX}px ${backgroundY}px`,
          backgroundSize: '400px 400px',
          width: `${pieceWidth}px`,
          height: `${pieceHeight}px`
        }}
      />
    );
  };

  return (
    <div className="puzzle-game-player">
      <div className="game-header">
        <h2>Biology Quiz Game</h2>
        <div className="header-right">
          <div className="game-score">Score: {score}</div>
          <button 
            onClick={onQuitGame}
            className="quit-btn"
            title="Quit Game"
          >
            ❌ Quit
          </button>
          {/* Debug button hidden for production
          <button 
            onClick={toggleDebugMode}
            className={`debug-toggle ${debugMode ? 'active' : ''}`}
            title="Toggle Debug Mode (Ctrl+D)"
          >
            🐛 Debug
          </button>
          */}
        </div>
      </div>

      {/* Debug panel hidden for production
      {debugMode && (
        <div className="debug-panel">
          <div className="debug-info">
            <strong>🐛 Debug Mode Active</strong>
            <span>Current Stage: {gameState}</span>
            <span>Press 'S' to skip to next stage</span>
            <span>Flow: puzzle1 → question1 → review1 → puzzle2 → question2 → review2 → combined → review3 → vocabulary → mitosis_learning_screen → mitosis_sorting → mitosis_review → timeline_learning_screen → timeline_game → timeline_review → mitosis_card_learning_screen → mitosis_card_game → meiosis_learning_screen → meiosis_fill_blank → complete</span>
          </div>
          <div className="debug-controls">
            <button onClick={skipToNextStage} className="skip-btn">
              ⏭️ Skip to Next Stage
            </button>
            <button onClick={toggleDebugDropdownMode} className="dropdown-btn">
              {debugDropdownMode ? '🔽 Hide Game Selector' : '🔼 Show Game Selector'}
            </button>
          </div>
          
          {debugDropdownMode && (
            <div className="debug-dropdown">
              <h4>Select Game to Test:</h4>
              <div className="game-options">
                <button 
                  onClick={() => selectDebugGame('learning_screen')}
                  className={`game-option ${selectedDebugGame === 'learning_screen' ? 'selected' : ''}`}
                >
                  📚 Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('puzzle1')}
                  className={`game-option ${selectedDebugGame === 'puzzle1' ? 'selected' : ''}`}
                >
                  🧩 Puzzle 1
                </button>
                <button 
                  onClick={() => selectDebugGame('question1')}
                  className={`game-option ${selectedDebugGame === 'question1' ? 'selected' : ''}`}
                >
                  ❓ Question 1
                </button>
                <button 
                  onClick={() => selectDebugGame('question1_review')}
                  className={`game-option ${selectedDebugGame === 'question1_review' ? 'selected' : ''}`}
                >
                  📋 Question 1 Review
                </button>
                <button 
                  onClick={() => selectDebugGame('puzzle2')}
                  className={`game-option ${selectedDebugGame === 'puzzle2' ? 'selected' : ''}`}
                >
                  🧩 Puzzle 2
                </button>
                <button 
                  onClick={() => selectDebugGame('question2')}
                  className={`game-option ${selectedDebugGame === 'question2' ? 'selected' : ''}`}
                >
                  ❓ Question 2
                </button>
                <button 
                  onClick={() => selectDebugGame('question2_review')}
                  className={`game-option ${selectedDebugGame === 'question2_review' ? 'selected' : ''}`}
                >
                  📋 Question 2 Review
                </button>
                <button 
                  onClick={() => selectDebugGame('combined_question')}
                  className={`game-option ${selectedDebugGame === 'combined_question' ? 'selected' : ''}`}
                >
                  🔗 Combined Question
                </button>
                <button 
                  onClick={() => selectDebugGame('combined_review')}
                  className={`game-option ${selectedDebugGame === 'combined_review' ? 'selected' : ''}`}
                >
                  📋 Combined Review
                </button>
                <button 
                  onClick={() => selectDebugGame('single_image_question')}
                  className={`game-option ${selectedDebugGame === 'single_image_question' ? 'selected' : ''}`}
                >
                  🖼️ Single Image Question
                </button>
                <button 
                  onClick={() => selectDebugGame('single_image_review')}
                  className={`game-option ${selectedDebugGame === 'single_image_review' ? 'selected' : ''}`}
                >
                  📋 Single Image Review
                </button>
                <button 
                  onClick={() => selectDebugGame('vocabulary')}
                  className={`game-option ${selectedDebugGame === 'vocabulary' ? 'selected' : ''}`}
                >
                  📚 Vocabulary Game
                </button>
                <button 
                  onClick={() => selectDebugGame('mitosis_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'mitosis_learning_screen' ? 'selected' : ''}`}
                >
                  🧬 Mitosis Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('mitosis_sorting')}
                  className={`game-option ${selectedDebugGame === 'mitosis_sorting' ? 'selected' : ''}`}
                >
                  🔄 Mitosis Sorting
                </button>
                <button 
                  onClick={() => selectDebugGame('mitosis_review')}
                  className={`game-option ${selectedDebugGame === 'mitosis_review' ? 'selected' : ''}`}
                >
                  📋 Mitosis Review
                </button>
                <button 
                  onClick={() => selectDebugGame('timeline_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'timeline_learning_screen' ? 'selected' : ''}`}
                >
                  ⏰ Timeline Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('timeline_game')}
                  className={`game-option ${selectedDebugGame === 'timeline_game' ? 'selected' : ''}`}
                >
                  ⏰ Timeline Game
                </button>
                <button 
                  onClick={() => selectDebugGame('timeline_review')}
                  className={`game-option ${selectedDebugGame === 'timeline_review' ? 'selected' : ''}`}
                >
                  📋 Timeline Review
                </button>
                <button 
                  onClick={() => selectDebugGame('mitosis_card_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'mitosis_card_learning_screen' ? 'selected' : ''}`}
                >
                  🃏 Mitosis Card Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('mitosis_card_game')}
                  className={`game-option ${selectedDebugGame === 'mitosis_card_game' ? 'selected' : ''}`}
                >
                  🃏 Mitosis Card Game
                </button>
                <button 
                  onClick={() => selectDebugGame('meiosis_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'meiosis_learning_screen' ? 'selected' : ''}`}
                >
                  🧬 Meiosis Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('meiosis_fill_blank')}
                  className={`game-option ${selectedDebugGame === 'meiosis_fill_blank' ? 'selected' : ''}`}
                >
                  ✏️ Meiosis Fill Blank
                </button>
                <button 
                  onClick={() => selectDebugGame('meiosis_fill_blank_review')}
                  className={`game-option ${selectedDebugGame === 'meiosis_fill_blank_review' ? 'selected' : ''}`}
                >
                  📋 Meiosis Fill Blank Review
                </button>
                <button 
                  onClick={() => selectDebugGame('meiosis_drag_drop_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'meiosis_drag_drop_learning_screen' ? 'selected' : ''}`}
                >
                  🎯 Meiosis Drag Drop Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('meiosis_drag_drop')}
                  className={`game-option ${selectedDebugGame === 'meiosis_drag_drop' ? 'selected' : ''}`}
                >
                  🎯 Meiosis Drag & Drop
                </button>
                <button 
                  onClick={() => selectDebugGame('venn_diagram_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'venn_diagram_learning_screen' ? 'selected' : ''}`}
                >
                  🔵 Venn Diagram Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('venn_diagram')}
                  className={`game-option ${selectedDebugGame === 'venn_diagram' ? 'selected' : ''}`}
                >
                  🔵 Venn Diagram
                </button>
                <button 
                  onClick={() => selectDebugGame('teacher_fill_blanks_learning_screen')}
                  className={`game-option ${selectedDebugGame === 'teacher_fill_blanks_learning_screen' ? 'selected' : ''}`}
                >
                  📝 Teacher Fill Blanks Learning Screen
                </button>
                <button 
                  onClick={() => selectDebugGame('teacher_fill_blanks')}
                  className={`game-option ${selectedDebugGame === 'teacher_fill_blanks' ? 'selected' : ''}`}
                >
                  📝 Teacher Fill in the Blanks
                </button>
                <button 
                  onClick={() => selectDebugGame('game_complete')}
                  className={`game-option ${selectedDebugGame === 'game_complete' ? 'selected' : ''}`}
                >
                  🏁 Game Complete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      */}

      {gameState === 'learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning1.png" 
                alt="Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('puzzle1')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Start Puzzle
              </button>
            </div>
          </div>
        </div>
      )}

      {(gameState === 'puzzle1' || gameState === 'puzzle2') && (
        <div className="puzzle-stage">
          <div className="stage-instructions">
            <h3>🧩 {gameState === 'puzzle1' ? 'Complete Puzzle 1' : 'Complete Puzzle 2'}</h3>
            <p>Drag pieces from the left into the correct positions to match the reference image!</p>
          </div>
          
          <div className="puzzle-game-container">
            {/* Left side - Shuffled pieces */}
            <div className="puzzle-pieces-panel">
              <h4>🎲 Puzzle Pieces</h4>
              <div className="pieces-grid">
                {puzzlePieces.filter(piece => !piece.placed).map((piece) => (
                  <div
                    key={piece.id}
                    data-piece-id={piece.id}
                    className="draggable-piece"
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece)}
                    onDragEnd={handleDragEnd}
                  >
                    {renderPuzzlePiece(piece)}
                  </div>
                ))}
              </div>
              {puzzlePieces.filter(piece => !piece.placed).length === 0 && (
                <div className="all-pieces-placed">
                  🎉 All pieces placed!
                </div>
              )}
            </div>

            {/* Right side - Reference image and drop grid */}
            <div className="puzzle-drop-grid">
              <div className="reference-image-section">
                <h4>🖼️ Reference Image</h4>
                <div className="reference-image">
                  {(gameState === 'puzzle1' && imageLoaded) || (gameState === 'puzzle2' && imageLoaded2) ? (
                    <img 
                      src={gameState === 'puzzle1' ? gameData.image_url : gameData.image_url_2} 
                      alt="Reference" 
                      className="reference-img"
                    />
                  ) : (
                    <div className="reference-fallback">
                      <p>🎯 Build the complete image below</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="drop-grid-section">
                <h4>🔨 Build Here</h4>
                <div className="grid-container">
                  {gridSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`grid-slot ${slot ? 'filled' : 'empty'}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDoubleClick={() => handleSlotDoubleClick(index)}
                    >
                      {slot ? (
                        <div className="placed-piece">
                          {renderPuzzlePiece(slot)}
                        </div>
                      ) : (
                        <div className="empty-slot"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid-instructions">
                  <small>💡 Double-click placed pieces to remove them</small>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden images for loading */}
          <img
            ref={imageRef}
            src={gameData.image_url}
            alt="Puzzle 1"
            style={{ display: 'none' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            crossOrigin="anonymous"
          />
          {gameData.image_url_2 && (
            <img
              ref={imageRef2}
              src={gameData.image_url_2}
              alt="Puzzle 2"
              style={{ display: 'none' }}
              onLoad={handleImageLoad2}
              onError={handleImageError2}
              crossOrigin="anonymous"
            />
          )}
        </div>
      )}

      {(gameState === 'question1' || gameState === 'question2') && (
        <div className="question-stage">
          <div className="stage-instructions">
            <h3>❓ {gameState === 'question1' ? 'Answer Question 1' : 'Answer Question 2'}</h3>
          </div>
          
          <div className="completed-puzzle-display">
            <div className="completed-image">
              {((gameState === 'question1' && imageLoaded) || (gameState === 'question2' && imageLoaded2)) ? (
                <img 
                  src={gameState === 'question1' ? gameData.image_url : gameData.image_url_2} 
                  alt="Completed puzzle" 
                />
              ) : (
                <div className="completed-fallback">
                  <p>Puzzle completed!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="question-container">
            <h4>{gameState === 'question1' ? gameData.question : gameData.question_2}</h4>
            <div className="answer-options">
              {(gameState === 'question1' ? gameData.multiple_choice_options : gameData.multiple_choice_options_2)?.map((option, index) => (
                <React.Fragment key={index}>
                  <button
                    className={`answer-option ${(gameState === 'question1' ? selectedAnswer : selectedAnswer2) === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </button>
                  {index === 0 && <div className="or-separator">OR</div>}
                </React.Fragment>
              ))}
            </div>
            <button 
              className="submit-answer-btn"
              onClick={submitAnswer}
              disabled={(gameState === 'question1' ? selectedAnswer : selectedAnswer2) === null}
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}

      {gameState === 'question1_review' && (
        <div className="review-stage">
          <div className="stage-instructions">
            <h3>📋 Question 1 Review</h3>
            <p>Here's how you did on the first question:</p>
          </div>
          
          <div className="review-card">
            <div className="review-header">
              <h4>Question 1 Results</h4>
              <div className="review-score">
                {selectedAnswer === gameData.correct_answer_index ? (
                  <span className="score-correct">✅ 10/10 pts</span>
                ) : (
                  <span className="score-incorrect">❌ 0/10 pts</span>
                )}
              </div>
            </div>
            
            <div className="review-content">
              <div className="review-image">
                {imageLoaded ? (
                  <img 
                    src={gameData.image_url} 
                    alt="Puzzle 1" 
                  />
                ) : (
                  <div className="review-image-fallback">Puzzle 1</div>
                )}
              </div>
              
              <div className="review-details">
                <div className="question-text">
                  <strong>Question:</strong> {gameData.question}
                </div>
                
                <div className="answer-comparison">
                  <div className="student-answer">
                    <strong>Your Answer:</strong>
                    <span className={selectedAnswer === gameData.correct_answer_index ? 'correct' : 'incorrect'}>
                      {gameData.multiple_choice_options?.[selectedAnswer] || 'No answer selected'}
                    </span>
                  </div>
                  
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong>
                    <span className="correct">
                      {gameData.multiple_choice_options?.[gameData.correct_answer_index]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={continueFromQuestion1Review} className="continue-btn">
              Continue to Puzzle 2 →
            </button>
          </div>
        </div>
      )}

      {gameState === 'question2_review' && (
        <div className="review-stage">
          <div className="stage-instructions">
            <h3>📋 Question 2 Review</h3>
            <p>Here's how you did on the second question:</p>
          </div>
          
          <div className="review-card">
            <div className="review-header">
              <h4>Question 2 Results</h4>
              <div className="review-score">
                {selectedAnswer2 === gameData.correct_answer_index_2 ? (
                  <span className="score-correct">✅ 10/10 pts</span>
                ) : (
                  <span className="score-incorrect">❌ 0/10 pts</span>
                )}
              </div>
            </div>
            
            <div className="review-content">
              <div className="review-image">
                {imageLoaded2 ? (
                  <img 
                    src={gameData.image_url_2} 
                    alt="Puzzle 2" 
                  />
                ) : (
                  <div className="review-image-fallback">Puzzle 2</div>
                )}
              </div>
              
              <div className="review-details">
                <div className="question-text">
                  <strong>Question:</strong> {gameData.question_2}
                </div>
                
                <div className="answer-comparison">
                  <div className="student-answer">
                    <strong>Your Answer:</strong>
                    <span className={selectedAnswer2 === gameData.correct_answer_index_2 ? 'correct' : 'incorrect'}>
                      {gameData.multiple_choice_options_2?.[selectedAnswer2] || 'No answer selected'}
                    </span>
                  </div>
                  
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong>
                    <span className="correct">
                      {gameData.multiple_choice_options_2?.[gameData.correct_answer_index_2]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={continueFromQuestion2Review} className="continue-btn">
              Continue to Final Question →
            </button>
          </div>
        </div>
      )}

      {gameState === 'combined_review' && (
        <div className="review-stage">
          <div className="stage-instructions">
            <h3>📋 Combined Question Review</h3>
            <p>Here's how you did on the analysis question:</p>
          </div>
          
          <div className="review-card">
            <div className="review-header">
              <h4>Combined Analysis Results</h4>
              <div className="review-score">
                {combinedAnswer === 'MITOSIS' ? (
                  <span className="score-correct">✅ 5/5 pts</span>
                ) : (
                  <span className="score-incorrect">❌ 0/5 pts</span>
                )}
              </div>
            </div>
            
            <div className="review-content">
              <div className="review-images-dual">
                <div className="dual-image">
                  <h5>Puzzle 1</h5>
                  {imageLoaded ? (
                    <img src={gameData.image_url} alt="Puzzle 1" />
                  ) : (
                    <div className="review-image-fallback">Puzzle 1</div>
                  )}
                </div>
                <div className="dual-image">
                  <h5>Puzzle 2</h5>
                  {imageLoaded2 ? (
                    <img src={gameData.image_url_2} alt="Puzzle 2" />
                  ) : (
                    <div className="review-image-fallback">Puzzle 2</div>
                  )}
                </div>
              </div>
              
              <div className="review-details">
                <div className="question-text">
                  <strong>Question:</strong> The type of cell division responsible for both growth and repair in the body is ______.
                </div>
                
                <div className="answer-comparison">
                  <div className="student-answer">
                    <strong>Your Answer:</strong>
                    <span className={combinedAnswer === 'MITOSIS' ? 'correct' : 'incorrect'}>
                      {combinedAnswer || 'No answer provided'}
                    </span>
                  </div>
                  
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong>
                    <span className="correct">MITOSIS</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={continueFromCombinedReview} className="continue-btn">
              Continue to Vocabulary →
            </button>
          </div>
        </div>
      )}

      {gameState === 'combined_question' && (
        <div className="combined-question-stage">
          <div className="stage-instructions">
            <h3>🔬 Combined Analysis Question</h3>
            <p>Based on both images you completed, drag the correct answer to complete the sentence:</p>
          </div>
          
          <div className="combined-question-container">
            {/* Left - Puzzle 1 Image */}
            <div className="puzzle-reference">
              <h4>Puzzle 1</h4>
              <div className="reference-image-small">
                {imageLoaded ? (
                  <img 
                    src={gameData.image_url} 
                    alt="Puzzle 1 completed" 
                  />
                ) : (
                  <div className="reference-fallback-small">Puzzle 1</div>
                )}
              </div>
            </div>

            {/* Center - Question with blank */}
            <div className="combined-question-text">
              <div className="question-statement">
                <p>The type of cell division responsible for both growth and repair in the body is</p>
                <div 
                  className={`answer-blank ${combinedAnswer ? 'filled' : 'empty'}`}
                  onDragOver={handleCombinedDragOver}
                  onDrop={handleCombinedDrop}
                  onClick={clearCombinedAnswer}
                >
                  {combinedAnswer || 'Drop answer here'}
                </div>
                <p>.</p>
              </div>
              
              {/* Draggable answer options */}
              <div className="combined-answer-options">
                {['MITOSIS', 'MEIOSIS'].map((option, index) => (
                  <div
                    key={index}
                    className={`draggable-option ${combinedAnswer === option ? 'used' : ''}`}
                    draggable={combinedAnswer !== option}
                    onDragStart={(e) => handleCombinedDragStart(e, option)}
                    onDragEnd={handleCombinedDragEnd}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <button 
                className="submit-combined-btn"
                onClick={submitCombinedAnswer}
                disabled={!combinedAnswer}
              >
                Submit Answer
              </button>
            </div>

            {/* Right - Puzzle 2 Image */}
            <div className="puzzle-reference">
              <h4>Puzzle 2</h4>
              <div className="reference-image-small">
                {imageLoaded2 ? (
                  <img 
                    src={gameData.image_url_2} 
                    alt="Puzzle 2 completed" 
                  />
                ) : (
                  <div className="reference-fallback-small">Puzzle 2</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'single_image_question' && (
        <div className="single-image-question-stage">
          <div className="stage-instructions">
            <h3>📸 Single Image Question</h3>
            <p>Choose an answer from below, then drag it to complete the sentence:</p>
          </div>
          
          <div className="single-image-question-container">
            {/* Top - Single Image */}
            <div className="single-image-display">
              <img 
                src={gameData.single_image_url} 
                alt="Question image" 
                className="single-question-image"
              />
            </div>

            {/* Bottom - Question with blank */}
            <div className="single-question-text">
              {/* Draggable answer options - moved to top */}
              <div className="single-answer-options">
                {(gameData.single_question_options || ['MITOSIS', 'MEIOSIS']).map((option, index) => (
                  <div
                    key={index}
                    className={`draggable-option ${singleImageAnswer === option ? 'used' : ''}`}
                    draggable={singleImageAnswer !== option}
                    onDragStart={(e) => handleSingleImageDragStart(e, option)}
                    onDragEnd={handleSingleImageDragEnd}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <div className="question-statement">
                <div className="question-with-blank">
                  <div 
                    className={`answer-blank ${singleImageAnswer ? 'filled' : 'empty'}`}
                    onDragOver={handleSingleImageDragOver}
                    onDrop={handleSingleImageDrop}
                    onClick={clearSingleImageAnswer}
                  >
                    {singleImageAnswer || 'Drop answer here'}
                  </div>
                  <span className="question-text">{gameData.single_question.replace(/^_+/, '').trim()}</span>
                </div>
              </div>
              
              <button 
                className="submit-single-btn"
                onClick={submitSingleImageAnswer}
                disabled={!singleImageAnswer}
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'single_image_review' && (
        <div className="review-stage">
          <div className="review-header">
            <h3>📸 Single Image Question Review</h3>
            <p>Let's review your answer to the single image question.</p>
          </div>
          
          <div className="review-content">
            <div className="review-single-image">
              <img 
                src={gameData.single_image_url} 
                alt="Question image" 
                className="review-single-image-display"
              />
            </div>
            
            <div className="review-details">
              <div className="question-text">
                <strong>Question:</strong> {gameData.single_question}
              </div>
              
              <div className="answer-comparison">
                <div className="student-answer">
                  <strong>Your Answer:</strong>
                  <span className={singleImageAnswer === gameData.single_question_correct_answer ? 'correct' : 'incorrect'}>
                    {singleImageAnswer || 'No answer provided'}
                  </span>
                </div>
                
                <div className="correct-answer">
                  <strong>Correct Answer:</strong>
                  <span className="correct">{gameData.single_question_correct_answer}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button onClick={continueFromSingleImageReview} className="continue-btn">
            Continue to Vocabulary →
          </button>
        </div>
      )}

      {gameState === 'vocabulary' && (
        <div className="vocabulary-stage">
          <VocabularyMatchingGame 
            vocabularyData={gameData.vocabulary_terms || [
              { term: "MITOSIS", definition: "Divides a eukaryotic cell's chromosome into identical daughter nuclei." },
              { term: "CYTOKINESIS", definition: "Distribution of cytoplasm to daughter cells following division of a cell's chromosomes." },
              { term: "CENTROSOME", definition: "Structure that organizes the microtubules that make up the spindle in animal cells." },
              { term: "SPINDLE", definition: "Array of microtubule proteins that move chromosomes during mitosis and meiosis." },
              { term: "MEIOSIS", definition: "Forms genetically variable nuclei, each containing half as many chromosomes as the organism's diploid cells." },
              { term: "HOMOLOGOUS PAIR", definition: "Two chromosomes that have the same gene sequence but may have different alleles of those genes." }
            ]}
            onComplete={handleVocabularyComplete}
          />
        </div>
      )}

      {gameState === 'mitosis_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning2.png" 
                alt="Mitosis Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('mitosis_sorting')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'mitosis_sorting' && (
        <div className="mitosis-sorting-stage">
          <div className="stage-instructions">
            <h3>The Mitosis Sorting Game: Can You Place the Stages Correctly?</h3>
            <p>Drag the descriptions below to match them with the correct mitosis stages. You can place multiple descriptions in each stage box.</p>
          </div>
          
          <div className="mitosis-sorting-container">
            {/* Top - Stage Images in a row */}
            <div className="mitosis-stages-row">
              {[0, 1, 2, 3, 4].map((stageIndex) => (
                <div key={stageIndex} className="mitosis-stage-box">
                  <div className="stage-image-container">
                    <img 
                      src={gameData.mitosis_stage_images[stageIndex]} 
                      alt={``}
                      className="stage-image"
                    />
                  </div>
                  
                  {/* Drop zone for descriptions */}
                  <div 
                    className="stage-drop-zone"
                    onDragOver={handleMitosisDragOver}
                    onDrop={(e) => handleMitosisDrop(e, stageIndex)}
                  >
                    {/* Show descriptions placed in this stage */}
                    {Object.keys(mitosisMatches).map(descriptionIndex => {
                      if (mitosisMatches[descriptionIndex] === stageIndex) {
                        const description = gameData.mitosis_descriptions[descriptionIndex];
                        return (
                          <div 
                            key={descriptionIndex} 
                            className="placed-description"
                            draggable
                            onDragStart={(e) => handleMitosisDragStart(e, descriptionIndex)}
                            onDragEnd={handleMitosisDragEnd}
                            onClick={() => removeMitosisDescription(descriptionIndex)}
                            title="Click to remove"
                          >
                            {description}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom - Scrollable descriptions area */}
            <div className="descriptions-area">
              <h4>Descriptions to Drag:</h4>
              <div className="descriptions-list">
                {(gameData.mitosis_descriptions || []).map((description, index) => {
                  // Only show descriptions that haven't been placed yet
                  if (mitosisMatches[index] === undefined) {
                    return (
                      <div
                        key={index}
                        className="draggable-description"
                        draggable
                        onDragStart={(e) => handleMitosisDragStart(e, index)}
                        onDragEnd={handleMitosisDragEnd}
                      >
                        {description}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Submit button - only show when all descriptions are placed */}
            {Object.keys(mitosisMatches).length === (gameData.mitosis_descriptions || []).length && (
              <div className="mitosis-submit-area">
                <button 
                  className="submit-mitosis-btn"
                  onClick={submitMitosisSorting}
                >
                  Submit Answers
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'mitosis_review' && (
        <div className="review-stage">
          <div className="review-header">
            <h3>🧬 Mitosis Sorting Review</h3>
            <p>Let's review your mitosis stage matching.</p>
          </div>
          
          {/* Move score summary above the grid */}
          <div className="mitosis-score-summary">
            <h4>Your Score:</h4>
            <p>
              {(() => {
                let correctMatches = 0;
                const correctMatchesData = gameData.mitosis_correct_matches || {};
                Object.keys(mitosisMatches).forEach(descriptionIndex => {
                  if (mitosisMatches[descriptionIndex] === correctMatchesData[descriptionIndex]) {
                    correctMatches++;
                  }
                });
                return `${correctMatches} out of ${Object.keys(mitosisMatches).length} correct`;
              })()}
            </p>
          </div>
          <div className="review-content">
            <div className="mitosis-review-grid">
              {[0, 1, 2, 3, 4].map((stageIndex) => (
                <div key={stageIndex} className="review-stage-box">
                  <div className="review-stage-image">
                    <img 
                      src={gameData.mitosis_stage_images[stageIndex]} 
                      alt={``}
                    />
                  </div>
                  
                  <div className="review-descriptions">
                    {Object.keys(mitosisMatches).map(descriptionIndex => {
                      if (mitosisMatches[descriptionIndex] === stageIndex) {
                        const description = gameData.mitosis_descriptions[descriptionIndex];
                        const isCorrect = gameData.mitosis_correct_matches[descriptionIndex] === stageIndex;
                        return (
                          <div 
                            key={descriptionIndex} 
                            className={`review-description ${isCorrect ? 'correct' : 'incorrect'}`}
                          >
                            {description}
                            <span className="feedback-icon">
                              {isCorrect ? '✅' : '❌'}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={continueFromMitosisReview} className="continue-btn">
            Continue to Timeline Game →
          </button>
        </div>
      )}

      {gameState === 'timeline_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning 3.png" 
                alt="Timeline Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('timeline_game')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'timeline_game' && (
        <div className="timeline-game-stage">
          <div className="stage-instructions">
            <h3>The Mitosis Shuffle: Put the Stages in Order</h3>
            <p>Drag the images below into the correct chronological order on the timeline. You can reorder or remove images as needed.</p>
          </div>
          
          <div className="timeline-game-container">
            {/* Timeline with numbered slots and arrows - Redesigned */}
            <div className="timeline-frame-display">
              <div className="timeline-frame-header">
                <div className="timeline-frame-title">⏰ Timeline Sequence</div>
                <div className="timeline-frame-subtitle">Arrange the images in chronological order</div>
              </div>
              <div className="timeline-slots-container">
                {[0, 1, 2, 3, 4].map((slotIndex) => (
                  <div key={slotIndex} className="timeline-slot-wrapper">
                    <div className="timeline-slot-number-large">{slotIndex + 1}</div>
                    <div 
                      className={`timeline-slot-redesigned ${timelineSlots[slotIndex] !== null ? 'filled' : 'empty'}`}
                      onDragOver={handleTimelineDragOver}
                      onDrop={(e) => handleTimelineDrop(e, slotIndex)}
                      onClick={() => timelineSlots[slotIndex] !== null && removeTimelineImage(slotIndex)}
                      title={timelineSlots[slotIndex] !== null ? "Click to remove" : "Drop image here"}
                    >
                      {timelineSlots[slotIndex] !== null && (
                        <img 
                          src={gameData.timeline_images[timelineSlots[slotIndex]]} 
                          alt="Timeline image"
                          className="timeline-slot-image-redesigned"
                        />
                      )}
                      {timelineSlots[slotIndex] === null && (
                        <div className="empty-slot-placeholder">
                          <span className="placeholder-icon">📷</span>
                          <span className="placeholder-text">Drop here</span>
                        </div>
                      )}
                    </div>
                    {slotIndex < 4 && <div className="timeline-arrow-redesigned">→</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Image pool below timeline - Redesigned */}
            <div className="timeline-image-pool-redesigned">
              <div className="image-pool-header">
                <h4>📸 Images to Arrange</h4>
                <p>Drag these images to the timeline above</p>
              </div>
              <div className="timeline-images-showcase-redesigned">
                {(gameData.timeline_images || []).map((imageUrl, imageIndex) => {
                  // Only show images that haven't been placed yet
                  if (!timelineSlots.includes(imageIndex)) {
                    return (
                      <div
                        key={imageIndex}
                        className="timeline-draggable-image-redesigned"
                        draggable
                        onDragStart={(e) => handleTimelineDragStart(e, imageIndex)}
                        onDragEnd={handleTimelineDragEnd}
                      >
                        <div className="draggable-image-container">
                          <img src={imageUrl} alt={`Image ${imageIndex + 1}`} />
                        </div>
                        <div className="draggable-image-label">Image {imageIndex + 1}</div>
                      </div>
                    );
                  }
                  return null;
                })}
                {(gameData.timeline_images || []).filter((_, idx) => !timelineSlots.includes(idx)).length === 0 && (
                  <div className="timeline-empty-pool">
                    <div className="empty-pool-icon">✅</div>
                    <p>All images placed!</p>
                    <small>Ready to submit your timeline</small>
                  </div>
                )}
              </div>
            </div>

            {/* Submit button - only show when all slots are filled */}
            {timelineSlots.every(slot => slot !== null) && (
              <div className="timeline-submit-area-redesigned">
                <button 
                  className="submit-timeline-btn-redesigned"
                  onClick={submitTimelineGame}
                >
                  <span className="submit-icon">🚀</span>
                  <span>Submit Timeline</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'timeline_review' && (
        <div className="review-stage">
          <div className="review-header">
            <h3>⏰ Timeline Review</h3>
            <p>Let's review your timeline arrangement.</p>
          </div>
          
          {/* Move score summary above the grid */}
          <div className="timeline-score-summary">
            <h4>Your Score:</h4>
            <p>
              {(() => {
                let correctPositions = 0;
                const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
                
                timelineSlots.forEach((imageIndex, slotIndex) => {
                  if (imageIndex !== null && correctOrder[slotIndex] === imageIndex + 1) {
                    correctPositions++;
                  }
                });
                
                return `${correctPositions} out of 5 correct (${correctPositions * 2} points)`;
              })()}
            </p>
          </div>
          
          <div className="review-content">
            <div className="timeline-review-grid">
              {[0, 1, 2, 3, 4].map((slotIndex) => {
                const studentImageIndex = timelineSlots[slotIndex];
                const correctImageIndex = (gameData.timeline_correct_order || [1, 2, 3, 4, 5])[slotIndex] - 1;
                const isCorrect = studentImageIndex === correctImageIndex;
                const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
                
                return (
                  <div key={slotIndex} className="timeline-review-stage-box">
                    <div className="timeline-review-stage-title">
                      Position {slotIndex + 1}
                    </div>
                    <div className="timeline-review-stage-image">
                      {studentImageIndex !== null && (
                        <img 
                          src={gameData.timeline_images[studentImageIndex]} 
                          alt="Timeline stage"
                          className={`timeline-review-image ${isCorrect ? 'correct' : 'incorrect'}`}
                        />
                      )}
                    </div>
                    
                    <div className="timeline-review-feedback">
                      <div className={`timeline-feedback-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? 'Correct Position ✅' : 'Incorrect Position ❌'}
                      </div>
                      {!isCorrect && studentImageIndex !== null && (
                        <div className="timeline-correct-position">
                          Should be in position {correctOrder.indexOf(studentImageIndex + 1) + 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button onClick={continueFromTimelineReview} className="continue-btn">
            Continue to Next Game →
          </button>
        </div>
      )}

      {gameData.mitosis_cards && gameState === 'mitosis_card_game' && (
        <MitosisCardGame
          cards={gameData.mitosis_cards}
          onComplete={(score) => {
            setScore(prev => prev + score);
            setGameState('meiosis_learning_screen');
          }}
        />
      )}

      {gameState === 'meiosis_fill_blank' && (
        <MeiosisFillBlankGame
          questions={[
            {
              id: 1,
              question: "Meiosis ensures genetic ___",
              options: ["diversity", "duplication"],
              correct_answer: "diversity",
              explanation: "Meiosis creates genetic diversity through crossing-over and independent assortment."
            },
            {
              id: 2,
              question: "Meiosis creates ___ cells, which are essential for sexual reproduction.",
              options: ["haploid", "diploid"],
              correct_answer: "haploid",
              explanation: "Meiosis reduces the chromosome number by half, creating haploid cells."
            },
            {
              id: 3,
              question: "The reduction in chromosome number during meiosis is crucial for ___ the chromosome number of offspring.",
              options: ["maintaining", "growing"],
              correct_answer: "maintaining",
              explanation: "Meiosis maintains the chromosome number across generations by reducing it before fertilization."
            },
            {
              id: 4,
              question: "Meiosis leads to the production of genetically ___ offspring.",
              options: ["identical", "unique"],
              correct_answer: "unique",
              explanation: "Meiosis produces genetically unique offspring through genetic recombination."
            },
            {
              id: 5,
              question: "Meiosis occurs in ___ cells.",
              options: ["somatic", "sex"],
              correct_answer: "sex",
              explanation: "Meiosis occurs in sex cells (gametes) to produce reproductive cells."
            },
            {
              id: 6,
              question: "Meiosis ensures that the chromosome number remains ___ across generations.",
              options: ["constant", "variable"],
              correct_answer: "constant",
              explanation: "Meiosis maintains a constant chromosome number across generations."
            },
            {
              id: 7,
              question: "___ restores the diploid number of chromosomes after meiosis.",
              options: ["Fertilization", "Division"],
              correct_answer: "Fertilization",
              explanation: "Fertilization combines two haploid gametes to restore the diploid number."
            },
            {
              id: 8,
              question: "Meiosis occurs in two stages, ______ (Mitosis I/Meiosis I) and ______ (Mitosis II/Meiosis II), to reduce the chromosome number by half.",
              options: ["Meiosis I", "Meiosis II"],
              correct_answer: ["Meiosis I", "Meiosis II"],
              explanation: "Meiosis I and Meiosis II are the two stages of meiosis, occurring in that specific order."
            },
            {
              id: 9,
              question: "Meiosis contributes to evolution by creating genetic ___ through processes like crossing-over and independent assortment, leading to different combinations of genes.",
              options: ["stability", "variation"],
              correct_answer: "variation",
              explanation: "Meiosis creates genetic variation through crossing-over and independent assortment."
            }
          ]}
          onComplete={(score, answers) => {
            setScore(prev => prev + score);
            setMeiosisAnswers(answers);
            setGameState('meiosis_drag_drop_learning_screen');
          }}
        />
      )}

      {gameState === 'meiosis_drag_drop_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning 6.png" 
                alt="Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('meiosis_drag_drop')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'meiosis_drag_drop' && (
        <>
          {console.log('🔍 About to render MeiosisDragDropGame, gameState:', gameState)}
          <MeiosisDragDropGame
            gameData={gameData}
            onComplete={(score, answers) => {
              console.log('🔍 MeiosisDragDropGame completed with score:', score);
              console.log('🔍 Setting gameState to venn_diagram_learning_screen');
              setScore(prev => prev + score);
              setMeiosisDragAnswers(answers);
              setGameState('venn_diagram_learning_screen');
            }}
          />
        </>
      )}

      {gameState === 'venn_diagram_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning 7.png" 
                alt="Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('venn_diagram')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'venn_diagram' && (
        <>
          {console.log('🔍 About to render VennDiagramGame, gameState:', gameState)}
          {console.log('🔍 Current gameState is:', gameState)}
          <VennDiagramGame
            gameData={gameData}
            onGameComplete={(result) => {
              console.log('🔍 VennDiagramGame completed with result:', result);
              setScore(prev => prev + result.score);
              setVennDiagramAnswers(result.answers);
              setGameState('teacher_fill_blanks_learning_screen');
            }}
          />
        </>
      )}



      {gameState === 'teacher_fill_blanks_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning8.png" 
                alt="Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('teacher_fill_blanks')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'teacher_fill_blanks' && (
        <>
          {console.log('🔍 About to render TeacherFillInTheBlanksGame, gameState:', gameState)}
          <TeacherFillInTheBlanksGame
            gameData={gameData}
            onGameComplete={(result) => {
              console.log('🔍 TeacherFillInTheBlanksGame completed with result:', result);
              setScore(prev => prev + result.score);
              setTeacherFillBlanksAnswers(result.answers);
              
              // Just transition to game complete screen
              // onGameComplete will be called from the final summary button
              setGameState('game_complete');
            }}
          />
        </>
      )}

      {gameState === 'game_complete' && (
        <div className="game-complete-screen">
          <div className="game-complete-header">
            <h2>🎉 Game Complete!</h2>
            <p>Great job!</p>
            <div className="progress-saved-banner">
              <span>✅ Progress Saved to Your Account</span>
            </div>
          </div>

                      <div className="score-cards-container">
              <div className="score-card final-score-card">
                <h3>Final Score</h3>
                <div className="score-value">{calculateFinalScore()}</div>
              </div>
              <div className="score-card time-card">
                <h3>Time Taken</h3>
                <div className="time-value">{Math.floor((Date.now() - startTime) / 1000)}s</div>
              </div>
            </div>

          <div className="performance-summary">
            <h3>Performance Summary</h3>
            <div className="summary-items">
              <div className="summary-item">
                <span className="summary-icon">🧩</span>
                <span className="summary-text">Puzzles Completed</span>
                <span className="summary-status">✅ 2/2</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">❓</span>
                <span className="summary-text">Questions Correct</span>
                <span className="summary-status">✅ {(() => {
                  let correct = 0;
                  if (selectedAnswer === gameData.correct_answer_index) correct++;
                  if (selectedAnswer2 === gameData.correct_answer_index_2) correct++;
                  if (combinedAnswer === 'MITOSIS') correct++;
                  if (singleImageAnswer === gameData.single_question_correct_answer) correct++;
                  return `${correct}/4`;
                })()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">🔓</span>
                <span className="summary-text">Vocabulary Completed</span>
                <span className="summary-status">✅ Yes</span>
              </div>
            </div>
          </div>

          <div className="score-breakdown">
            <h3>Score Breakdown</h3>
            <div className="breakdown-items">
              <div className="breakdown-item puzzle-completion">
                <div className="breakdown-icon">🧩</div>
                <div className="breakdown-text">Puzzle Completion</div>
                <div className="breakdown-points">20 points</div>
              </div>
              <div className="breakdown-item question-answers">
                <div className="breakdown-icon">❓</div>
                <div className="breakdown-text">Question Answers</div>
                <div className="breakdown-points">{(() => {
                  let points = 0;
                  if (selectedAnswer === gameData.correct_answer_index) points += 10;
                  if (selectedAnswer2 === gameData.correct_answer_index_2) points += 10;
                  if (combinedAnswer === 'MITOSIS') points += 5;
                  if (singleImageAnswer === gameData.single_question_correct_answer) points += 5;
                  return `${points} points`;
                })()}</div>
              </div>
              <div className="breakdown-item vocabulary-matching">
                <div className="breakdown-icon">🔓</div>
                <div className="breakdown-text">Vocabulary Matching</div>
                <div className="breakdown-points">{(() => {
                  // Since vocabulary score is already included in total score, 
                  // calculate it as the difference from other components
                  const question1Points = selectedAnswer === gameData.correct_answer_index ? 10 : 0;
                  const question2Points = selectedAnswer2 === gameData.correct_answer_index_2 ? 10 : 0;
                  const combinedPoints = combinedAnswer === 'MITOSIS' ? 5 : 0;
                  const singleImagePoints = singleImageAnswer === gameData.single_question_correct_answer ? 5 : 0;
                  
                  // Calculate other game points
                  const mitosisPoints = (() => {
                    let correctMatches = 0;
                    const correctMatchesData = gameData.mitosis_correct_matches || {};
                    Object.keys(mitosisMatches).forEach(descriptionIndex => {
                      if (mitosisMatches[descriptionIndex] === correctMatchesData[descriptionIndex]) {
                        correctMatches++;
                      }
                    });
                    return correctMatches;
                  })();
                  
                  const timelinePoints = (() => {
                    let correctPositions = 0;
                    const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
                    timelineSlots.forEach((imageIndex, slotIndex) => {
                      if (imageIndex !== null && correctOrder[slotIndex] === imageIndex + 1) {
                        correctPositions++;
                      }
                    });
                    return correctPositions * 2;
                  })();
                  
                  const meiosisFillPoints = (() => {
                    const questions = gameData.meiosis_fill_blank_questions || [];
                    let correctAnswers = 0;
                    questions.forEach(q => {
                      const studentAnswer = meiosisAnswers[q.id];
                      if (Array.isArray(q.correct_answer)) {
                        if (Array.isArray(studentAnswer) || typeof studentAnswer === 'object') {
                          const arr = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer[0], studentAnswer[1]];
                          if (q.correct_answer.every((ans, idx) => arr[idx] === ans)) {
                            correctAnswers++;
                          }
                        }
                      } else {
                        if (studentAnswer === q.correct_answer) {
                          correctAnswers++;
                        }
                      }
                    });
                    return correctAnswers * 2;
                  })();
                  
                  const meiosisDragPoints = (() => {
                    const correctMappings = {
                      "interphase": "Chromatin duplicated",
                      "prophase1": "Crossing over occurs",
                      "prophase1_spindle": "Spindle fibers start to reach out to centromeres of homologous chromosomes",
                      "metaphase1": "Homologous chromosomes line up at the equator",
                      "anaphase1": "Homologous chromosomes are pulled apart to opposite poles of the cell",
                      "telophase1_cytoplasm": "Cytoplasm divides amongst daughter cells",
                      "telophase1_cells": "Two daughter cells are created",
                      "prophase2": "Spindle fibers start to reach out to centromeres of sister chromatids",
                      "metaphase2": "Sister chromatids line up along the equator",
                      "anaphase2_separate": "Sister chromatids separate",
                      "anaphase2_move": "Sister chromatids move to opposite poles",
                      "telophase2": "Daughter cells divide, forming 4 haploid cells"
                    };
                    let correctAnswers = 0;
                    Object.keys(correctMappings).forEach(phaseId => {
                      if (meiosisDragAnswers[phaseId] === correctMappings[phaseId]) {
                        correctAnswers++;
                      }
                    });
                    return correctAnswers * 2;
                  })();
                  
                  const vennPoints = (() => {
                    const descriptions = gameData?.venn_diagram_descriptions || [];
                    const correctPlacements = gameData?.venn_diagram_correct_placements || {};
                    let correctAnswers = 0;
                    descriptions.forEach((_, index) => {
                      const correctSection = correctPlacements[index.toString()];
                      const studentSection = vennDiagramAnswers[correctSection];
                      if (studentSection && studentSection.includes(index)) {
                        correctAnswers++;
                      }
                    });
                    return correctAnswers * 2;
                  })();
                  
                  const teacherFillPoints = (() => {
                    const questions = gameData?.teacher_fill_blanks_questions || [];
                    let correctAnswers = 0;
                    questions.forEach((question, questionIndex) => {
                      const questionAnswers = teacherFillBlanksAnswers[questionIndex] || [];
                      question.blanks.forEach((blank, blankIndex) => {
                        const userAnswer = questionAnswers[blankIndex] || '';
                        if (userAnswer.toLowerCase().trim() === blank.answer.toLowerCase().trim()) {
                          correctAnswers++;
                        }
                      });
                    });
                    return correctAnswers * 5;
                  })();
                  
                  // Calculate vocabulary points as remaining score
                  const otherPoints = 20 + question1Points + question2Points + combinedPoints + singleImagePoints + mitosisPoints + timelinePoints + meiosisFillPoints + meiosisDragPoints + vennPoints + teacherFillPoints;
                  const vocabularyPoints = Math.max(0, calculateFinalScore() - otherPoints);
                  
                  return `${vocabularyPoints} points`;
                })()}</div>
              </div>
              <div className="breakdown-item mitosis-sorting">
                <div className="breakdown-icon">🧬</div>
                <div className="breakdown-text">Mitosis Sorting</div>
                <div className="breakdown-points">{(() => {
                  let correctMatches = 0;
                  const correctMatchesData = gameData.mitosis_correct_matches || {};
                  Object.keys(mitosisMatches).forEach(descriptionIndex => {
                    if (mitosisMatches[descriptionIndex] === correctMatchesData[descriptionIndex]) {
                      correctMatches++;
                    }
                  });
                  return `${correctMatches} points`;
                })()}</div>
              </div>
              <div className="breakdown-item timeline-game">
                <div className="breakdown-icon">⏰</div>
                <div className="breakdown-text">Timeline Game</div>
                <div className="breakdown-points">{(() => {
                  let correctPositions = 0;
                  const correctOrder = gameData.timeline_correct_order || [1, 2, 3, 4, 5];
                  timelineSlots.forEach((imageIndex, slotIndex) => {
                    if (imageIndex !== null && correctOrder[slotIndex] === imageIndex + 1) {
                      correctPositions++;
                    }
                  });
                  return `${correctPositions * 2} points`;
                })()}</div>
              </div>
              <div className="breakdown-item mitosis-card-game">
                <div className="breakdown-icon">🃏</div>
                <div className="breakdown-text">Mitosis Card Game</div>
                <div className="breakdown-points">0 points</div>
              </div>
              <div className="breakdown-item meiosis-fill-blanks">
                <div className="breakdown-icon">✏️</div>
                <div className="breakdown-text">Meiosis Fill-in-the-Blanks</div>
                <div className="breakdown-points">{(() => {
                  const questions = gameData.meiosis_fill_blank_questions || [
                    { id: 1, correct_answer: "diversity" },
                    { id: 2, correct_answer: "haploid" },
                    { id: 3, correct_answer: "maintaining" },
                    { id: 4, correct_answer: "unique" },
                    { id: 5, correct_answer: "sex" },
                    { id: 6, correct_answer: "constant" },
                    { id: 7, correct_answer: "Fertilization" },
                    { id: 8, correct_answer: ["Meiosis I", "Meiosis II"] },
                    { id: 9, correct_answer: "variation" }
                  ];
                  let correctAnswers = 0;
                  questions.forEach(q => {
                    const studentAnswer = meiosisAnswers[q.id];
                    if (Array.isArray(q.correct_answer)) {
                      if (Array.isArray(studentAnswer) || typeof studentAnswer === 'object') {
                        const arr = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer[0], studentAnswer[1]];
                        if (q.correct_answer.every((ans, idx) => arr[idx] === ans)) {
                          correctAnswers++;
                        }
                      }
                    } else {
                      if (studentAnswer === q.correct_answer) {
                        correctAnswers++;
                      }
                    }
                  });
                  return `${correctAnswers * 2} points`;
                })()}</div>
              </div>
              <div className="breakdown-item meiosis-drag-drop">
                <div className="breakdown-icon">🔄</div>
                <div className="breakdown-text">Meiosis Drag & Drop</div>
                <div className="breakdown-points">{(() => {
                  const correctMappings = {
                    "interphase": "Chromatin duplicated",
                    "prophase1": "Crossing over occurs",
                    "prophase1_spindle": "Spindle fibers start to reach out to centromeres of homologous chromosomes",
                    "metaphase1": "Homologous chromosomes line up at the equator",
                    "anaphase1": "Homologous chromosomes are pulled apart to opposite poles of the cell",
                    "telophase1_cytoplasm": "Cytoplasm divides amongst daughter cells",
                    "telophase1_cells": "Two daughter cells are created",
                    "prophase2": "Spindle fibers start to reach out to centromeres of sister chromatids",
                    "metaphase2": "Sister chromatids line up along the equator",
                    "anaphase2_separate": "Sister chromatids separate",
                    "anaphase2_move": "Sister chromatids move to opposite poles",
                    "telophase2": "Daughter cells divide, forming 4 haploid cells"
                  };
                  let correctAnswers = 0;
                  Object.keys(correctMappings).forEach(phaseId => {
                    if (meiosisDragAnswers[phaseId] === correctMappings[phaseId]) {
                      correctAnswers++;
                    }
                  });
                  return `${correctAnswers * 2} points`;
                })()}</div>
              </div>
              <div className="breakdown-item venn-diagram">
                <div className="breakdown-icon">🔗</div>
                <div className="breakdown-text">Venn Diagram</div>
                <div className="breakdown-points">{(() => {
                  const descriptions = gameData?.venn_diagram_descriptions || [];
                  const correctPlacements = gameData?.venn_diagram_correct_placements || {};
                  let correctAnswers = 0;
                  descriptions.forEach((_, index) => {
                    const correctSection = correctPlacements[index.toString()];
                    const studentSection = vennDiagramAnswers[correctSection];
                    if (studentSection && studentSection.includes(index)) {
                      correctAnswers++;
                    }
                  });
                  return `${correctAnswers * 2} points`;
                })()}</div>
              </div>
              <div className="breakdown-item teacher-fill-blanks">
                <div className="breakdown-icon">📝</div>
                <div className="breakdown-text">Teacher Fill in the Blanks</div>
                <div className="breakdown-points">{(() => {
                  const questions = gameData?.teacher_fill_blanks_questions || [];
                  let correctAnswers = 0;
                  let totalBlanks = 0;
                  questions.forEach((question, questionIndex) => {
                    const questionAnswers = teacherFillBlanksAnswers[questionIndex] || [];
                    question.blanks.forEach((blank, blankIndex) => {
                      totalBlanks++;
                      const userAnswer = questionAnswers[blankIndex] || '';
                      if (userAnswer.toLowerCase().trim() === blank.answer.toLowerCase().trim()) {
                        correctAnswers++;
                      }
                    });
                  });
                  return `${correctAnswers * 5} points`;
                })()}</div>
              </div>
            </div>
          </div>

                  <div className="game-complete-actions">
          <button className="play-again-btn" onClick={() => window.location.reload()}>
            🔄 Play Again
          </button>
          <button className="home-btn" onClick={() => window.location.href = '/'}>
            🏠 Home
          </button>
        </div>
        </div>
      )}

      {gameState === 'mitosis_card_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning4.png" 
                alt="Mitosis Card Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('mitosis_card_game')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'meiosis_learning_screen' && (
        <div className="learning-screen">
          <div className="learning-container">
            <div className="learning-image-container">
              <img 
                src="/images/learning5.png" 
                alt="Meiosis Learning Instructions" 
                className="learning-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="learning-actions">
              <button 
                onClick={() => setGameState('meiosis_fill_blank')}
                className="start-puzzle-btn"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#04796b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '20px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#036c5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#04796b'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PuzzleGamePlayer; 