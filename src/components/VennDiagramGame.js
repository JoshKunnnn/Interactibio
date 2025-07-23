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
  const [showReinforcement, setShowReinforcement] = useState(false);
  const [reinforcementMsg, setReinforcementMsg] = useState('');
  const [score, setScore] = useState(0);
  const [draggedDescription, setDraggedDescription] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);

  // Debug logging
  console.log('🔍 VennDiagramGame received gameData:', gameData);
  console.log('🔍 Venn diagram descriptions from gameData:', gameData?.venn_diagram_descriptions);
  console.log('🔍 Venn diagram placements from gameData:', gameData?.venn_diagram_correct_placements);

  // Helper function to safely parse jsonb data
  const parseJsonbData = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && !Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse jsonb data:', data, e);
        return null;
      }
    }
    return null;
  };

  // Parse the data properly
  const parsedDescriptions = parseJsonbData(gameData?.venn_diagram_descriptions);
  const parsedPlacements = parseJsonbData(gameData?.venn_diagram_correct_placements);

  console.log('🔍 Parsed descriptions:', parsedDescriptions);
  console.log('🔍 Parsed placements:', parsedPlacements);
  console.log('🔍 Are parsed descriptions an array?', Array.isArray(parsedDescriptions));
  console.log('🔍 Length of parsed descriptions:', parsedDescriptions?.length);

  // Get descriptions from gameData - prioritize database data
  const descriptions = (parsedDescriptions && Array.isArray(parsedDescriptions) && parsedDescriptions.length > 0) 
    ? parsedDescriptions 
    : [
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

  // Get correct placements from gameData - prioritize database data
  const correctPlacements = (parsedPlacements && typeof parsedPlacements === 'object' && Object.keys(parsedPlacements).length > 0)
    ? parsedPlacements
    : {
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

  console.log('🔍 Final descriptions being used:', descriptions);
  console.log('🔍 Final placements being used:', correctPlacements);

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
    
    // Calculate percent and show reinforcement
    const percent = (correctCount / totalDescriptions) * 100;
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
      <h2>Mitosis vs. Meiosis: The Great Divide!</h2>
      <p>Use the Venn Diagram to compare and contrast mitosis and meiosis. Drag and drop the key characteristics into the correct sections.</p>
      <div className="puzzle-direction-text">
        <p><strong>Direction:</strong> Use the Venn Diagram to compare and contrast mitosis and meiosis. Drag and drop the key characteristics into the correct sections: the left for mitosis, the right for meiosis, and the overlapping middle section for shared features.</p>
      </div>
      
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