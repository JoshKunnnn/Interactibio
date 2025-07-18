import React, { useState } from 'react';
import './VennDiagramGame.css';

const VennDiagramGame = ({ gameData, onGameComplete }) => {
  const [placedDescriptions, setPlacedDescriptions] = useState({
    mitosis: [],
    meiosis: [],
    both: []
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(0);
  const [draggedDescription, setDraggedDescription] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);

  // Get descriptions from gameData or use defaults
  const descriptions = gameData?.venn_diagram_descriptions || [
    "1 division",
    "Produces 2 daughter cells", 
    "Diploid",
    "Produces somatic cells",
    "Produces genetically identical cells",
    "Occurs in somatic cells throughout the body",
    "Cell division",
    "Goal of producing new cells",
    "Cytokinesis",
    "Spindle formation",
    "Crossing over and independent assortment occur.",
    "2 divisions",
    "Produces 4 daughter cells",
    "Haploid",
    "Produces gametes",
    "Introduces genetic variation",
    "Occurs only in reproductive organs"
  ];

  // Get correct placements from gameData or use defaults
  const correctPlacements = gameData?.venn_diagram_correct_placements || {
    "0": "mitosis",
    "1": "mitosis", 
    "2": "mitosis",
    "3": "mitosis",
    "4": "mitosis",
    "5": "mitosis",
    "6": "both",
    "7": "both",
    "8": "both", 
    "9": "both",
    "10": "meiosis",
    "11": "meiosis",
    "12": "meiosis",
    "13": "meiosis",
    "14": "meiosis",
    "15": "meiosis",
    "16": "meiosis"
  };

  const handleDragStart = (e, descriptionIndex) => {
    if (isCompleted) return;
    setDraggedDescription(descriptionIndex);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', descriptionIndex.toString());
    e.target.classList.add('dragging');
  };

  const handleDragOver = (e, section) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(section);
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
  };

  const handleDrop = (e, section) => {
    e.preventDefault();
    setDragOverSection(null);
    if (draggedDescription !== null) {
      setPlacedDescriptions(prev => ({
        ...prev,
        [section]: [...prev[section], draggedDescription]
      }));
      setDraggedDescription(null);
    }
  };

  const handleDragEnd = (e) => {
    setDraggedDescription(null);
    setDragOverSection(null);
    e.target.classList.remove('dragging');
  };

  const handleRemoveDescription = (section, descriptionIndex) => {
    if (isCompleted) return;
    
    setPlacedDescriptions(prev => ({
      ...prev,
      [section]: prev[section].filter((_, index) => index !== descriptionIndex)
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const totalDescriptions = descriptions.length;
    
    // Check each description placement
    descriptions.forEach((_, index) => {
      const correctSection = correctPlacements[index.toString()];
      const isCorrectlyPlaced = placedDescriptions[correctSection].includes(index);
      if (isCorrectlyPlaced) {
        correctCount++;
      }
    });
    
    const finalScore = correctCount * 2; // 2 points per correct placement
    setScore(finalScore);
    setIsCompleted(true);
    setShowReview(true);
  };

  const getAvailableDescriptions = () => {
    const usedDescriptions = [
      ...placedDescriptions.mitosis,
      ...placedDescriptions.meiosis,
      ...placedDescriptions.both
    ];
    return descriptions.filter((_, index) => !usedDescriptions.includes(index));
  };

  const handleFinishReview = () => {
    if (onGameComplete) {
      onGameComplete({
        gameType: 'venn-diagram',
        score: score,
        totalPossible: descriptions.length * 2,
        answers: placedDescriptions,
        correctAnswers: correctPlacements
      });
    }
  };

  if (showReview) {
    return (
      <div className="venn-diagram-review">
        <h2>Venn Diagram Review</h2>
        
        <div className="review-score">
          <h3>Your Score:</h3>
          <p>{Math.floor(score / 2)} out of {descriptions.length} correct ({score} points)</p>
        </div>
        
        <div className="review-sections">
          <div className="review-section">
            <h3>Mitosis Section</h3>
            <div className="review-items">
              {placedDescriptions.mitosis.map((descIndex, index) => {
                const isCorrect = correctPlacements[descIndex.toString()] === 'mitosis';
                return (
                  <div key={`mitosis-${descIndex}`} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="description-text">{descriptions[descIndex]}</span>
                    <span className="status">{isCorrect ? '✓' : '✗'}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="review-section">
            <h3>Both Section</h3>
            <div className="review-items">
              {placedDescriptions.both.map((descIndex, index) => {
                const isCorrect = correctPlacements[descIndex.toString()] === 'both';
                return (
                  <div key={`both-${descIndex}`} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="description-text">{descriptions[descIndex]}</span>
                    <span className="status">{isCorrect ? '✓' : '✗'}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="review-section">
            <h3>Meiosis Section</h3>
            <div className="review-items">
              {placedDescriptions.meiosis.map((descIndex, index) => {
                const isCorrect = correctPlacements[descIndex.toString()] === 'meiosis';
                return (
                  <div key={`meiosis-${descIndex}`} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className="description-text">{descriptions[descIndex]}</span>
                    <span className="status">{isCorrect ? '✓' : '✗'}</span>
                  </div>
                );
              })}
            </div>
          </div>
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
    <div className="venn-diagram-game">
      <h2>Mitosis vs. Meiosis: The Great Divide!</h2>
      <p>Use the Venn Diagram to compare and contrast mitosis and meiosis. Drag and drop the key characteristics into the correct sections.</p>
      
      <div className="venn-container">
        {/* Venn Diagram */}
        <div className="venn-diagram">
          <div 
            className={`venn-section mitosis ${dragOverSection === 'mitosis' ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, 'mitosis')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'mitosis')}
          >
            <h3>MITOSIS</h3>
            <div className="placed-descriptions">
              {placedDescriptions.mitosis.map((descIndex, index) => (
                <div 
                  key={`mitosis-${descIndex}`}
                  className="placed-description"
                  onClick={() => handleRemoveDescription('mitosis', index)}
                  title="Click to remove"
                >
                  {descriptions[descIndex]}
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className={`venn-section both ${dragOverSection === 'both' ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, 'both')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'both')}
          >
            <h3>BOTH</h3>
            <div className="placed-descriptions">
              {placedDescriptions.both.map((descIndex, index) => (
                <div 
                  key={`both-${descIndex}`}
                  className="placed-description"
                  onClick={() => handleRemoveDescription('both', index)}
                  title="Click to remove"
                >
                  {descriptions[descIndex]}
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className={`venn-section meiosis ${dragOverSection === 'meiosis' ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, 'meiosis')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'meiosis')}
          >
            <h3>MEIOSIS</h3>
            <div className="placed-descriptions">
              {placedDescriptions.meiosis.map((descIndex, index) => (
                <div 
                  key={`meiosis-${descIndex}`}
                  className="placed-description"
                  onClick={() => handleRemoveDescription('meiosis', index)}
                  title="Click to remove"
                >
                  {descriptions[descIndex]}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Available Descriptions */}
        <div className="available-descriptions">
          <h3>Available Descriptions:</h3>
          <div className="descriptions-list">
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
          disabled={getAvailableDescriptions().length > 0}
        >
          Submit Answers
        </button>
        <div className="progress">
          {descriptions.length - getAvailableDescriptions().length} / {descriptions.length} descriptions placed
        </div>
      </div>
    </div>
  );
};

export default VennDiagramGame; 