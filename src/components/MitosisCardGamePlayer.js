import React, { useState, useEffect } from 'react';
import './PuzzleGamePlayer.css'; // Reuse some styles for consistency

// Placeholder/mock data for 3 cards
const mockCards = [
  {
    id: 1,
    imageUrl: require('../assets/images/student-1.jpg'),
    question: 'Creating genetic variation',
    correctAnswer: 'not_significant',
  },
  {
    id: 2,
    imageUrl: require('../assets/images/student-2.jpg'),
    question: 'Growth and repair of tissues',
    correctAnswer: 'significant',
  },
  {
    id: 3,
    imageUrl: require('../assets/images/student-3.jpg'),
    question: 'Asexual reproduction in some organisms',
    correctAnswer: 'significant',
  },
];

const CARD_BACK_IMAGE = require('../assets/images/student-learning.jpg'); // Placeholder for card back

const MitosisCardGamePlayer = ({ onGameComplete, gameData, onQuitGame }) => {
  // Use cards from gameData if available, else fallback to mockCards
  const cards = (gameData && Array.isArray(gameData.mitosis_cards) && gameData.mitosis_cards.length > 0)
    ? gameData.mitosis_cards.map((card, idx) => ({
        ...card,
        // Support both imageUrl and image_url keys
        imageUrl: card.imageUrl || card.image_url,
        id: card.id || idx + 1,
      }))
    : mockCards;

  const [flipped, setFlipped] = useState(Array(cards.length).fill(false));
  const [answers, setAnswers] = useState(Array(cards.length).fill(null));
  const [currentCard, setCurrentCard] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [startTime] = useState(Date.now());

  // Keyboard shortcuts for debug mode
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDebugMode();
      }
      if (debugMode && e.key === 's' && !e.ctrlKey) {
        e.preventDefault();
        skipToNextCard();
      }
      if (debugMode && e.key === 'c' && !e.ctrlKey) {
        e.preventDefault();
        completeGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [debugMode, currentCard]);

  // Add null check to prevent errors
  if (!gameData) {
    return (
      <div className="mitosis-card-game-container">
        <div className="game-header">
          <h2>Mitosis Card Game</h2>
          <div className="header-right">
            <div className="game-score">Score: 0</div>
            {onQuitGame && (
              <button 
                onClick={onQuitGame}
                className="quit-btn"
                title="Quit Game"
              >
                ❌ Quit
              </button>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h3>Loading game data...</h3>
          <p>Please wait while the game loads.</p>
        </div>
      </div>
    );
  }

  // Debug functions
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  const skipToNextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(f => f.map((val, i) => (i === currentCard + 1 ? true : val)));
    } else {
      setShowReview(true);
    }
  };

  const completeGame = () => {
    // Fill all answers with correct answers
    const correctAnswers = cards.map(card => card.correctAnswer);
    setAnswers(correctAnswers);
    setShowReview(true);
  };

  const handleFlip = (idx) => {
    setFlipped(f => f.map((val, i) => (i === idx ? true : val)));
  };

  const handleAnswer = (idx, answer) => {
    setAnswers(a => a.map((val, i) => (i === idx ? answer : val)));
    if (idx < cards.length - 1) {
      setCurrentCard(idx + 1);
    } else {
      setShowReview(true);
      // Optionally: call onGameComplete with results
      if (onGameComplete) {
        const score = answers.reduce((acc, ans, i) =>
          ans && ans === cards[i].correctAnswer ? acc + 5 : acc, 0
        );
        onGameComplete({ score, answers });
      }
    }
  };

  // Calculate score
  const score = answers.reduce((acc, ans, i) =>
    ans && ans === cards[i].correctAnswer ? acc + 5 : acc, 0
  );

  if (showReview) {
    return (
      <div className="mitosis-review-container">
        <h2>Review</h2>
        <p>Your Score: <b>{score}</b> / {cards.length * 5}</p>
        <div className="mitosis-review-cards">
          {cards.map((card, idx) => (
            <div key={card.id} className="mitosis-review-card">
              <img src={card.imageUrl} alt="Card" style={{ width: 120, height: 160, objectFit: 'cover', borderRadius: 12 }} />
              <div className="mitosis-review-question">{card.question}</div>
              <div className="mitosis-review-result">
                {answers[idx] === card.correctAnswer ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>✔ Correct</span>
                ) : (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>✘ Incorrect</span>
                )}
                <div style={{ fontSize: 12, color: '#888' }}>
                  Your answer: {answers[idx] === 'significant' ? 'Significance' : 'Not Significance'}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  Correct answer: {card.correctAnswer === 'significant' ? 'Significance' : 'Not Significance'}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Optionally: Add a button to replay or return */}
      </div>
    );
  }

  return (
    <div className="mitosis-card-game-container">
      <div className="game-header">
        <h2>Mitosis Card Game</h2>
        <div className="header-right">
          <div className="game-score">Score: {score}</div>
          {/* Debug button removed, logic remains */}
          {onQuitGame && (
            <button 
              onClick={onQuitGame}
              className="quit-btn"
              title="Quit Game"
            >
              ❌ Quit
            </button>
          )}
        </div>
      </div>

      {/* Debug Panel */}
      {debugMode && (
        <div className="debug-panel">
          <div className="debug-info">
            <span>🎮 Current Card: {currentCard + 1} / {cards.length}</span>
            <span>📊 Score: {score}</span>
            <span>⏱️ Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
          </div>
          
          <div className="debug-controls">
            <button onClick={skipToNextCard} className="skip-btn">
              ⏭️ Skip Card (S)
            </button>
            <button onClick={completeGame} className="skip-btn">
              🎯 Complete Game (C)
            </button>
          </div>
        </div>
      )}

      <div className="mitosis-card-area">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`mitosis-card ${flipped[idx] ? 'flipped' : ''} ${currentCard === idx ? 'active' : 'inactive'}`}
            style={{
              display: currentCard === idx ? 'block' : 'none',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            {!flipped[idx] ? (
              <div className="mitosis-card-back" onClick={() => handleFlip(idx)} style={{ cursor: 'pointer' }}>
                <img src={CARD_BACK_IMAGE} alt="Card Back" style={{ width: 180, height: 240, borderRadius: 16 }} />
                <div style={{ position: 'relative', top: -60, fontWeight: 'bold', fontSize: 28, color: '#1a4', textShadow: '1px 1px 4px #fff' }}>FLIP IT!</div>
              </div>
            ) : (
              <div className="mitosis-card-front" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 12 }}>
                <img src={card.imageUrl} alt="Card" style={{ width: 180, height: 140, borderRadius: 12 }} />
                <div style={{ margin: '16px 0 8px', fontWeight: 500, fontSize: 18 }}>{card.question}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                  <button
                    className="mitosis-btn red"
                    style={{ width: 56, height: 56, borderRadius: '50%', background: '#e44', border: 'none', color: '#fff', fontSize: 28, boxShadow: '0 2px 6px #0002', cursor: 'pointer' }}
                    onClick={() => handleAnswer(idx, 'not_significant')}
                    disabled={answers[idx] !== null}
                  >
                    ●
                  </button>
                  <button
                    className="mitosis-btn green"
                    style={{ width: 56, height: 56, borderRadius: '50%', background: '#2a5', border: 'none', color: '#fff', fontSize: 28, boxShadow: '0 2px 6px #0002', cursor: 'pointer' }}
                    onClick={() => handleAnswer(idx, 'significant')}
                    disabled={answers[idx] !== null}
                  >
                    ●
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MitosisCardGamePlayer; 