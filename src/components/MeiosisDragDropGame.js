import React, { useState } from 'react';
import './MeiosisDragDropGame.css';

const MeiosisDragDropGame = ({ gameData, onGameComplete }) => {
  const [placedAnswers, setPlacedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const [score, setScore] = useState(0);

  // Updated descriptions to match the 8 green boxes exactly
  const descriptions = [
    "Crossing over occurs. Spindle fibers start to reach out to centromeres of homologous chromosomes.",
    "Homologous chromosomes line up at the equator.",
    "Homologous chromosomes are pulled apart to opposite poles of the cell.",
    "Cytoplasm divides amongst daughter cells. Two daughter cells are created.",
    "Spindle fibers start to reach out to centromeres of sister chromatids.",
    "Sister chromatids line up along the equator.",
    "Sister chromatids separate. Sister chromatids move to opposite poles.",
    "Daughter cells divide, forming 4 haploid cells."
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
    setIsCompleted(true);
    setShowReview(true);
  };

  const handleFinishReview = () => {
    console.log('🔍 handleFinishReview called');
    if (onGameComplete) {
      console.log('🔍 Calling onGameComplete with score:', score);
      onGameComplete({
        gameType: 'meiosis-drag-drop',
        score: score,
        totalPossible: dropZones.length * 2,
        answers: placedAnswers,
        correctAnswers: dropZones.reduce((acc, zone) => {
          acc[zone.id] = zone.correctAnswer;
          return acc;
        }, {})
      });
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
      <h2>Map the Meiosis Mission!</h2>
      <p>Click the descriptions below to place them in the correct stages of meiosis on the diagram.</p>
      
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