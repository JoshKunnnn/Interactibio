import React, { useState } from 'react';
import './TeacherFillInTheBlanksGame.css';

const TeacherFillInTheBlanksGame = ({ gameData, onGameComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(0);

  // Get questions from gameData or use defaults
  const questions = gameData?.teacher_fill_blanks_questions || [
    {
      question: "Think about how plants grow in your garden. How do you think mitosis helps in the growth of a plant from seed?",
      text: "When a seed grows into a plant, mitosis helps the cells [1] and [2], creating new cells that allow the plant to grow taller, develop leaves, and even sprout flowers or fruits. Mitosis is key to the [3] of every plant.",
      blanks: [
        { position: "[1]", answer: "divide", length: 6 },
        { position: "[2]", answer: "multiply", length: 7 },
        { position: "[3]", answer: "growth", length: 5 }
      ]
    },
    {
      question: "Have you ever noticed that some animals, like lizards, can grow back their tails if they lose them? How do you think mitosis is involved in that process?",
      text: "When a lizard loses its tail, mitosis helps by creating [1] cells to regrow the tail, allowing the lizard to [2]. This shows how important mitosis is in [3] and [4] parts of the body.",
      blanks: [
        { position: "[1]", answer: "new", length: 3 },
        { position: "[2]", answer: "recover", length: 6 },
        { position: "[3]", answer: "repairing", length: 8 },
        { position: "[4]", answer: "regenerating", length: 11 }
      ]
    }
  ];

  // Get images from gameData or use defaults
  const images = gameData?.teacher_fill_blanks_images || [];

  const currentQuestion = questions[currentQuestionIndex];
  const currentImage = images[currentQuestionIndex];

  const handleAnswerChange = (blankIndex, value) => {
    const newAnswers = [...userAnswers];
    if (!newAnswers[currentQuestionIndex]) {
      newAnswers[currentQuestionIndex] = [];
    }
    newAnswers[currentQuestionIndex][blankIndex] = value;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    let totalCorrect = 0;
    let totalBlanks = 0;

    questions.forEach((question, questionIndex) => {
      const questionAnswers = userAnswers[questionIndex] || [];
      question.blanks.forEach((blank, blankIndex) => {
        totalBlanks++;
        const userAnswer = questionAnswers[blankIndex] || '';
        if (userAnswer.toLowerCase().trim() === blank.answer.toLowerCase().trim()) {
          totalScore += 5;
          totalCorrect++;
        }
      });
    });

    setScore(totalScore);
    setIsCompleted(true);
    setShowReview(true);
  };

  const handleFinishReview = () => {
    // Just call onGameComplete to transition to the next stage
    // The final database save will happen from the Game Complete screen
    if (onGameComplete) {
      onGameComplete({
        gameType: 'teacher-fill-blanks',
        score: score,
        totalPossible: questions.reduce((total, q) => total + q.blanks.length, 0) * 5,
        answers: userAnswers,
        questions: questions
      });
    }
  };

  // Convert numbered blanks to underscores for display
  const convertBlanksToUnderscores = (text, blanks) => {
    let result = text;
    blanks.forEach((blank, index) => {
      const firstLetter = blank.answer.charAt(0);
      const underscores = '_'.repeat(blank.answer.length - 1);
      const replacement = firstLetter + underscores;
      result = result.replace(blank.position, replacement);
    });
    return result;
  };

  // Render the fill-in-the-blanks text with input fields
  const renderTextWithBlanks = (text, blanks) => {
    let result = [];
    let currentText = text;

    blanks.forEach((blank, blankIndex) => {
      const blankIndexInText = currentText.indexOf(blank.position);
      if (blankIndexInText !== -1) {
        // Add text before the blank
        if (blankIndexInText > 0) {
          result.push(
            <span key={`text-${blankIndex}`}>
              {currentText.substring(0, blankIndexInText)}
            </span>
          );
        }

        // Add the input field
        const userAnswer = (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex][blankIndex]) || '';
        result.push(
          <input
            key={`input-${blankIndex}`}
            type="text"
            className="blank-input"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
            maxLength={blank.length}
            placeholder={blank.answer.charAt(0) + '_'.repeat(blank.answer.length - 1)}
            style={{ width: `${blank.length * 12}px` }}
          />
        );

        // Update current text to continue processing
        currentText = currentText.substring(blankIndexInText + blank.position.length);
      }
    });

    // Add remaining text
    if (currentText.length > 0) {
      result.push(
        <span key="text-end">
          {currentText}
        </span>
      );
    }

    return result;
  };

  if (showReview) {
    return (
      <div className="teacher-fill-blanks-review">
        <h2>Fill in the Blanks Review</h2>
        
        <div className="review-score">
          <h3>Your Score:</h3>
          <p>{score} points out of {questions.reduce((total, q) => total + q.blanks.length, 0) * 5} possible</p>
        </div>
        
        <div className="review-questions">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="review-question">
              <div className="review-question-header">
                <h3>Question {questionIndex + 1}</h3>
                {images[questionIndex] && (
                  <img 
                    src={images[questionIndex]} 
                    alt={`Question ${questionIndex + 1}`}
                    className="review-question-image"
                  />
                )}
              </div>
              
              <div className="review-question-content">
                <p className="review-question-text">{question.question}</p>
                <div className="review-answer-text">
                  {question.blanks.map((blank, blankIndex) => {
                    const userAnswer = (userAnswers[questionIndex] && userAnswers[questionIndex][blankIndex]) || '';
                    const isCorrect = userAnswer.toLowerCase().trim() === blank.answer.toLowerCase().trim();
                    return (
                      <div key={blankIndex} className={`review-blank ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <span className="blank-label">Blank {blankIndex + 1}:</span>
                        <span className="user-answer">"{userAnswer || '(empty)'}"</span>
                        <span className="correct-answer">Correct: "{blank.answer}"</span>
                        <span className="status">{isCorrect ? '✓' : '✗'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="review-navigation">
          <button className="continue-btn" onClick={handleFinishReview}>
            Continue to Game Complete →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-fill-blanks-game">
      <div className="game-instruction">
        <p>📝 Fill in the blanks with the correct words. Use the first letter hint to help you!</p>
      </div>
      <div className="puzzle-direction-text">
        <p><strong>Direction:</strong> Read the question and the paragraph carefully. Reflect on how both mitosis and meiosis contribute to real-life processes like muscle development and reproduction. Fill in the blanks with the correct terms related to both processes, focusing on how each one helps with growth, development, and the formation of new life. Use the first letter hint to help you!</p>
      </div>
      <div className="question-container">
        <div className="question-header">
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          {currentImage ? (
            <img 
              src={currentImage} 
              alt={`Question ${currentQuestionIndex + 1}`}
              className="question-image"
            />
          ) : (
            <div className="question-image-placeholder">
              <span>📷 Question {currentQuestionIndex + 1}</span>
            </div>
          )}
        </div>
        
        <div className="question-content">
          <p className="question-text">{currentQuestion.question}</p>
          <div className="fill-blanks-text">
            {renderTextWithBlanks(currentQuestion.text, currentQuestion.blanks)}
          </div>
        </div>
      </div>
      
      <div className="game-controls">
        <div className="navigation-buttons">
          <button 
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          
          <button 
            className="nav-btn next-btn"
            onClick={handleNext}
            disabled={!userAnswers[currentQuestionIndex] || userAnswers[currentQuestionIndex].some(answer => !answer)}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>
        
        <div className="progress">
          {currentQuestionIndex + 1} / {questions.length} questions
        </div>
      </div>
    </div>
  );
};

export default TeacherFillInTheBlanksGame; 