import React, { useState } from 'react';
import './MeiosisDragDropGame.css';

const MeiosisDragDropGame = ({ gameData, onGameComplete }) => {
  const [placedAnswers, setPlacedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showReinforcement, setShowReinforcement] = useState(false);
  const [reinforcementMsg, setReinforcementMsg] = useState('');

  const [score, setScore] = useState(0);

  // Updated descriptions to match the 8 green boxes exactly
  const descriptions = [
    "Chromosomes swap parts. Spindle fibers connect to chromosome centers (or centromeres).",
    "Homologous chromosomes line up in the middle.",
    "Homologous chromosomes are pulled to opposite sides.",
    "Cell splits its cytoplasm. Two new cells form.",
    "Spindle fibers attach to the center (or centromeres) of sister chromatids.",
    "Sister chromatids line up in the middle.",
    "Sister chromatids split and move to opposite sides.",
    "Cells divide again, making 4 haploid cells."
  ];

  // Drop zones with their correct answers (matching the 8 green boxes)
  const dropZones = [
    { id: 'prophase1', label: 'Prophase I', correctAnswer: 0 },
    { id: 'metaphase1', label: 'Metaphase I', correctAnswer: 1 },
    { id: 'anaphase1', label: 'Anaphase I', correctAnswer: 2 },
    { id: 'telophase1', label: 'Telophase I', correctAnswer: 3 },
    { id: 'prophase2', label: 'Prophase II', correctAnswer: 4 },
    { id: 'metaphase2', label: 'Metaphase II', correctAnswer: 5 },
    { id: 'anaphase2', label: 'Anaphase II', correctAnswer: 6 },
    { id: 'telophase2', label: 'Telophase II', correctAnswer: 7 }
  ];

  const [draggedDescription, setDraggedDescription] = useState(null);
  const [dragOverZone, setDragOverZone] = useState(null);

  const handleDragStart = (e, descriptionIndex) => {
    if (isCompleted) return;
    setDraggedDescription(descriptionIndex);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', descriptionIndex.toString());
    e.target.classList.add('dragging');
  };

  const handleDragOver = (e, zoneId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(zoneId);
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    setDragOverZone(null);
    if (draggedDescription !== null) {
      setPlacedAnswers(prev => ({
        ...prev,
        [zoneId]: draggedDescription
      }));
      setDraggedDescription(null);
    }
  };

  const handleDragEnd = (e) => {
    setDraggedDescription(null);
    setDragOverZone(null);
    e.target.classList.remove('dragging');
  };

  const handleDropZoneClick = (zoneId) => {
    if (isCompleted) return;
    
    // Remove the answer from this zone
    setPlacedAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[zoneId];
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    dropZones.forEach(zone => {
      if (placedAnswers[zone.id] === zone.correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = correctCount * 2; // 2 points per correct answer
    setScore(finalScore);
    
    // Calculate percent and show reinforcement
    const percent = (correctCount / dropZones.length) * 100;
    if (percent >= 70) {
      setReinforcementMsg('Great job!');
    } else {
      setReinforcementMsg('Keep practicing! Remember the key points for each learning activity.');
    }
    setShowReinforcement(true);
    setTimeout(() => {
      setShowReinforcement(false);
      setIsCompleted(true);
      setShowReview(true);
    }, 2500);
  };

  const handleFinishReview = () => {
    console.log('🔍 handleFinishReview called');
    console.log('🔍 onGameComplete function:', onGameComplete);
    console.log('🔍 score:', score);
    console.log('🔍 placedAnswers:', placedAnswers);
    
    if (onGameComplete) {
      console.log('🔍 Calling onGameComplete with score:', score);
      try {
        onGameComplete(score, placedAnswers);
        console.log('🔍 onGameComplete called successfully');
      } catch (error) {
        console.error('🔍 Error calling onGameComplete:', error);
      }
    } else {
      console.log('🔍 onGameComplete is not available');
    }
  };



  const getAvailableDescriptions = () => {
    const usedDescriptions = Object.values(placedAnswers);
    return descriptions.filter((_, index) => !usedDescriptions.includes(index));
  };

  if (showReview) {
    return (
      <div className="meiosis-drag-drop-review">
        <h2>Meiosis Drag & Drop Review</h2>
        
        <div className="review-score">
          <h3>Your Score:</h3>
          <p>{Math.floor(score / 2)} out of {dropZones.length} correct ({score} points)</p>
        </div>
        
        <div className="review-grid">
          {dropZones.map((zone) => {
            const studentAnswer = placedAnswers[zone.id];
            const isCorrect = studentAnswer === zone.correctAnswer;
            
            return (
              <div key={zone.id} className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>{zone.label}</h4>
                <div className="answer-comparison">
                  <div className="student-answer">
                    <strong>Your Answer:</strong>
                    <p>{studentAnswer !== undefined ? descriptions[studentAnswer] : 'No answer'}</p>
                  </div>
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong>
                    <p>{descriptions[zone.correctAnswer]}</p>
                  </div>
                </div>
                <div className={`status ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="review-navigation">
          <button className="continue-btn" onClick={handleFinishReview}>
            Next →
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="meiosis-game">
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
                setIsCompleted(true);
                setShowReview(true);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
      <h2>Map the Meiosis Mission!</h2>
      <div className="puzzle-direction-text">
        <p><strong>Direction:</strong> Summarize the stages that occur during meiosis and understand how cells divide to form sex cells through dragging and dropping each stage description to the correct spot in the meiosis picture to complete the process.</p>
      </div>
      
      <div className="game-container">
        {/* Diagram Section */}
        <div className="diagram-section">
          <img 
            src="/reward.png" 
            alt="Meiosis Diagram" 
            className="meiosis-image"
          />
          
          {/* Drop zones overlay */}
          <div className="drop-zones">
            {dropZones.map((zone) => (
              <div
                key={zone.id}
                className={`drop-zone ${placedAnswers[zone.id] !== undefined ? 'filled' : ''} ${dragOverZone === zone.id ? 'drag-over' : ''}`}
                data-zone={zone.id}
                onDragOver={(e) => handleDragOver(e, zone.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, zone.id)}
                onClick={() => handleDropZoneClick(zone.id)}
              >
                {placedAnswers[zone.id] !== undefined && (
                  <div className="placed-description">
                    {descriptions[placedAnswers[zone.id]]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Descriptions Section */}
        <div className="descriptions-section">
          <h3>Available Descriptions:</h3>
          <div className="available-descriptions">
            {getAvailableDescriptions().map((description, index) => {
              const originalIndex = descriptions.indexOf(description);
              return (
                <div
                  key={originalIndex}
                  className="description-item"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, originalIndex)}
                  onDragEnd={handleDragEnd}
                >
                  {description}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="game-controls">
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={Object.keys(placedAnswers).length < dropZones.length}
        >
          Submit Answers
        </button>
        <div className="progress">
          {Object.keys(placedAnswers).length} / {dropZones.length} descriptions placed
        </div>
      </div>
    </div>
  );
};

export default MeiosisDragDropGame; 