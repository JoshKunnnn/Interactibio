import React, { useState, useEffect } from 'react';
import './VocabularyMatchingGame.css';

const VocabularyMatchingGame = ({ vocabularyData, onComplete }) => {
  const [draggedKey, setDraggedKey] = useState(null);
  const [keyPlacements, setKeyPlacements] = useState({}); // Maps definitionId to termId
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);

  // Initialize shuffled terms and definitions
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

  useEffect(() => {
    if (vocabularyData && vocabularyData.length > 0) {
      // Create shuffled arrays with unique IDs
      const terms = vocabularyData.map((item, index) => ({
        id: index,
        text: item.term,
        placed: false
      }));
      
      const definitions = [...vocabularyData].map((item, index) => ({
        id: index,
        text: item.definition,
        hasKey: false
      }));
      
      // Shuffle definitions to make it challenging
      const shuffledDefs = [...definitions].sort(() => Math.random() - 0.5);
      
      setShuffledTerms(terms);
      setShuffledDefinitions(shuffledDefs);
    }
  }, [vocabularyData]);

  // Check if all padlocks have keys
  const areAllPadlocksFilled = () => {
    return Object.keys(keyPlacements).length === vocabularyData.length;
  };

  // Check answers and show results
  const checkAllAnswers = () => {
    let correct = 0;
    let totalScore = 0;

    Object.entries(keyPlacements).forEach(([definitionId, termId]) => {
      if (parseInt(definitionId) === parseInt(termId)) {
        correct++;
        totalScore += 10; // 10 points per correct match
      }
    });

    setCorrectMatches(correct);
    setScore(totalScore);
    setShowResults(true);
    
    // Complete the vocabulary game after showing results
    setTimeout(() => {
      setIsComplete(true);
      onComplete(totalScore);
    }, 3000);
  };

  // Handle drag start
  const handleDragStart = (e, term) => {
    if (term.placed) return;
    setDraggedKey(term);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop on padlock
  const handleDrop = (e, definition) => {
    e.preventDefault();
    
    if (!draggedKey) return;

    // Remove key from previous padlock if it was already placed
    const newKeyPlacements = { ...keyPlacements };
    
    // Remove this key from any previous placement
    Object.keys(newKeyPlacements).forEach(defId => {
      if (newKeyPlacements[defId] === draggedKey.id) {
        delete newKeyPlacements[defId];
      }
    });

    // If this padlock already has a key, remove that key's placement
    if (newKeyPlacements[definition.id] !== undefined) {
      const previousKeyId = newKeyPlacements[definition.id];
      setShuffledTerms(prev => prev.map(term => 
        term.id === previousKeyId ? { ...term, placed: false } : term
      ));
    }

    // Place the dragged key in this padlock
    newKeyPlacements[definition.id] = draggedKey.id;
    setKeyPlacements(newKeyPlacements);

    // Mark the term as placed
    setShuffledTerms(prev => prev.map(term => 
      term.id === draggedKey.id ? { ...term, placed: true } : term
    ));

    // Mark the definition as having a key
    setShuffledDefinitions(prev => prev.map(def => 
      def.id === definition.id ? { ...def, hasKey: true } : def
    ));

    setDraggedKey(null);

    // Check if all padlocks are filled
    if (Object.keys(newKeyPlacements).length === vocabularyData.length) {
      setTimeout(() => {
        checkAllAnswers();
      }, 500);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedKey(null);
  };

  // Remove key from padlock (double-click)
  const handlePadlockDoubleClick = (definition) => {
    if (keyPlacements[definition.id] !== undefined) {
      const keyId = keyPlacements[definition.id];
      
      // Remove from placements
      const newKeyPlacements = { ...keyPlacements };
      delete newKeyPlacements[definition.id];
      setKeyPlacements(newKeyPlacements);

      // Mark term as not placed
      setShuffledTerms(prev => prev.map(term => 
        term.id === keyId ? { ...term, placed: false } : term
      ));

      // Mark definition as not having a key
      setShuffledDefinitions(prev => prev.map(def => 
        def.id === definition.id ? { ...def, hasKey: false } : def
      ));
    }
  };

  // Get term text by ID
  const getTermTextById = (termId) => {
    const term = shuffledTerms.find(t => t.id === termId);
    return term ? term.text : '';
  };

  // Check if this match is correct (only show after all are complete)
  const isMatchCorrect = (definitionId, termId) => {
    return showResults && parseInt(definitionId) === parseInt(termId);
  };

  // Check if this match is incorrect (only show after all are complete)
  const isMatchIncorrect = (definitionId, termId) => {
    return showResults && parseInt(definitionId) !== parseInt(termId);
  };

  return (
    <div className="vocabulary-matching-game">
      <div className="vocabulary-header">
        <h2>🔓 UNLOCKING CONTENT AREA VOCABULARY</h2>
        <p>Drag each key (term) to the correct padlock (definition) to unlock the vocabulary!</p>
        {!showResults && (
          <div className="progress-indicator">
            {Object.keys(keyPlacements).length} of {vocabularyData.length} padlocks filled
          </div>
        )}
        {showResults && (
          <div className="results-indicator">
            <div className="score-display">Score: {score} points</div>
            <div className="accuracy-display">
              {correctMatches} out of {vocabularyData.length} correct ({Math.round((correctMatches / vocabularyData.length) * 100)}%)
            </div>
          </div>
        )}
      </div>

      <div className="vocabulary-game-container">
        {/* Left side - Draggable Keys (Terms) */}
        <div className="keys-section">
          <h3>🔑 KEYS (Terms)</h3>
          <div className="keys-container">
            {shuffledTerms.filter(term => !term.placed).map((term) => (
              <div
                key={term.id}
                className="key-item"
                draggable
                onDragStart={(e) => handleDragStart(e, term)}
                onDragEnd={handleDragEnd}
              >
                <div className="key-visual">
                  <span className="key-icon">🔑</span>
                  <span className="key-text">{term.text}</span>
                </div>
              </div>
            ))}
            {shuffledTerms.filter(term => !term.placed).length === 0 && !isComplete && (
              <div className="all-keys-used">
                <p>🎯 All keys have been placed!</p>
                <p>Checking your answers...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - Padlocks (Definitions) */}
        <div className="padlocks-section">
          <h3>🔒 PADLOCKS (Definitions)</h3>
          <div className="padlocks-container">
            {shuffledDefinitions.map((definition) => (
              <div
                key={definition.id}
                className={`padlock-item ${keyPlacements[definition.id] !== undefined ? 'has-key' : ''} ${
                  showResults && keyPlacements[definition.id] !== undefined 
                    ? isMatchCorrect(definition.id, keyPlacements[definition.id]) 
                      ? 'correct' 
                      : 'incorrect'
                    : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, definition)}
                onDoubleClick={() => handlePadlockDoubleClick(definition)}
              >
                <div className="padlock-visual">
                  <div className="padlock-icon">
                    {keyPlacements[definition.id] !== undefined ? '🔓' : '🔒'}
                  </div>
                  <div className="padlock-content">
                    <div className="definition-text">{definition.text}</div>
                    {keyPlacements[definition.id] !== undefined && (
                      <div className="inserted-key">
                        <span className="key-in-lock">🔑 {getTermTextById(keyPlacements[definition.id])}</span>
                        {showResults && (
                          <span className="result-indicator">
                            {isMatchCorrect(definition.id, keyPlacements[definition.id]) ? '✅' : '❌'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showResults && !isComplete && (
        <div className="results-summary">
          <h3>🎉 Results!</h3>
          <div className="results-breakdown">
            <div className="correct-matches">✅ Correct: {correctMatches}</div>
            <div className="incorrect-matches">❌ Incorrect: {vocabularyData.length - correctMatches}</div>
            <div className="final-score">🏆 Score: {score} points</div>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="vocabulary-complete">
          <h3>🎓 Vocabulary Challenge Complete!</h3>
          <p>Great work! You've completed the vocabulary matching challenge!</p>
        </div>
      )}


    </div>
  );
};

export default VocabularyMatchingGame; 