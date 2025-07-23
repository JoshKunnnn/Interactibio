import React, { useState, useEffect } from 'react';
import { uploadImage, createPuzzleGame, updatePuzzleGame } from '../lib/supabase';
import './GameCreationModal.css';

const GameCreationModal = ({ isOpen, onClose, subjectId, onGameCreated, editGame = null }) => {
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    gameType: 'puzzle',
    // Puzzle 1
    imageFile: null,
    imagePreview: null,
    question: '',
    multipleChoiceOptions: ['', ''],
    correctAnswerIndex: 0,
    // Puzzle 2
    imageFile2: null,
    imagePreview2: null,
    question2: '',
    multipleChoiceOptions2: ['', ''],
    correctAnswerIndex2: 0,
    // Single Image Question
    singleImageFile: null,
    singleImagePreview: null,
    singleQuestion: '',
    singleQuestionOptions: ['', ''],
    singleQuestionCorrectAnswer: '',
    // Mitosis Sorting Game
    mitosisStageImages: [],
    mitosisDescriptions: [],
    mitosisCorrectMatches: {},
    // Timeline Game
    timelineImages: [],
    timelineCorrectOrder: [1, 2, 3, 4, 5], // Default order: image 1 goes in slot 1, etc.
    // Meiosis Fill-in-the-Blanks Game
    meiosisFillBlankQuestions: [
      {
        id: 1,
        question: "Meiosis ensures genetic ___ (diversity/duplication).",
        options: ["diversity", "duplication"],
        correct_answer: "diversity",
        explanation: "Meiosis creates genetic diversity through crossing-over and independent assortment."
      },
      {
        id: 2,
        question: "Meiosis creates ___ (haploid/diploid) cells, which are essential for sexual reproduction.",
        options: ["haploid", "diploid"],
        correct_answer: "haploid",
        explanation: "Meiosis reduces the chromosome number by half, creating haploid cells."
      },
      {
        id: 3,
        question: "The reduction in chromosome number during meiosis is crucial for ___ (maintaining/growing) the chromosome number of offspring.",
        options: ["maintaining", "growing"],
        correct_answer: "maintaining",
        explanation: "Meiosis maintains the chromosome number across generations by reducing it before fertilization."
      },
      {
        id: 4,
        question: "Meiosis leads to the production of genetically ___ (identical/unique) offspring.",
        options: ["identical", "unique"],
        correct_answer: "unique",
        explanation: "Meiosis produces genetically unique offspring through genetic recombination."
      },
      {
        id: 5,
        question: "Meiosis occurs in ___ (somatic/sex) cells.",
        options: ["somatic", "sex"],
        correct_answer: "sex",
        explanation: "Meiosis occurs in sex cells (gametes) to produce reproductive cells."
      },
      {
        id: 6,
        question: "Meiosis ensures that the chromosome number remains ___ (constant/variable) across generations.",
        options: ["constant", "variable"],
        correct_answer: "constant",
        explanation: "Meiosis maintains a constant chromosome number across generations."
      },
      {
        id: 7,
        question: "___ (Fertilization/Division) restores the diploid number of chromosomes after meiosis.",
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
        question: "Meiosis contributes to evolution by creating genetic ___ (stability/variation) through processes like crossing-over and independent assortment, leading to different combinations of genes.",
        options: ["stability", "variation"],
        correct_answer: "variation",
        explanation: "Meiosis creates genetic variation through crossing-over and independent assortment."
      }
    ],
    // Teacher Fill-in-the-Blanks Game
    teacherFillBlanksQuestions: [],
    teacherFillBlanksImages: [],
    teacherFillBlanksCorrectAnswers: [],
    // Shared
    wordAnswer: '',
    vocabularyTerms: [
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' }
    ],
    instructions: 'Complete both puzzles, answer the questions, then match vocabulary terms!'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('teacher-fill-blanks'); // Add tab state
  const isEditMode = editGame !== null;

  // Add state for mitosis cards
  const [mitosisCards, setMitosisCards] = useState([]);
  const [newCard, setNewCard] = useState({ imageFile: null, imagePreview: null, question: '', correctAnswer: 'significant' });
  const [editingCardIndex, setEditingCardIndex] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editGame) {
      console.log('🔍 Loading edit game data:', editGame);
      
      // Helper function to safely handle arrays (could be text[] or jsonb)
      const parseArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error('Failed to parse array:', data, e);
            return [];
          }
        }
        // Handle jsonb objects that might be passed as objects
        if (typeof data === 'object' && data !== null) {
          // If it's already an object, it might be jsonb parsed by Supabase
          return Array.isArray(data) ? data : [];
        }
        return [];
      };

      // Helper function to safely parse jsonb objects
      const parseJsonbObject = (data) => {
        if (!data) return {};
        if (typeof data === 'object' && !Array.isArray(data)) return data;
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error('Failed to parse jsonb object:', data, e);
            return {};
          }
        }
        return {};
      };

      const mitosisDescriptions = parseArray(editGame.mitosis_descriptions);
      const mitosisStageImages = parseArray(editGame.mitosis_stage_images);
      const mitosisCorrectMatches = parseJsonbObject(editGame.mitosis_correct_matches);
      
      console.log('🔍 Parsed mitosis data:', {
        descriptions: mitosisDescriptions,
        stageImages: mitosisStageImages,
        correctMatches: mitosisCorrectMatches
      });

      // Add more detailed logging
      console.log('🔍 Raw editGame.mitosis_descriptions:', editGame.mitosis_descriptions);
      console.log('🔍 Raw editGame.mitosis_stage_images:', editGame.mitosis_stage_images);
      console.log('🔍 Raw editGame.mitosis_correct_matches:', editGame.mitosis_correct_matches);
      console.log('🔍 Type of mitosis_descriptions:', typeof editGame.mitosis_descriptions);
      console.log('🔍 Is Array?', Array.isArray(editGame.mitosis_descriptions));

      setGameData({
        title: editGame.title || '',
        description: editGame.description || '',
        gameType: editGame.game_type || 'puzzle',
        // Puzzle 1
        imageFile: null,
        imagePreview: editGame.image_url || null,
        question: editGame.question || '',
        multipleChoiceOptions: parseArray(editGame.multiple_choice_options) || ['', ''],
        correctAnswerIndex: editGame.correct_answer_index || 0,
        // Puzzle 2
        imageFile2: null,
        imagePreview2: editGame.image_url_2 || null,
        question2: editGame.question_2 || '',
        multipleChoiceOptions2: parseArray(editGame.multiple_choice_options_2) || ['', ''],
        correctAnswerIndex2: editGame.correct_answer_index_2 || 0,
        // Single Image Question
        singleImageFile: null,
        singleImagePreview: editGame.single_image_url || null,
        singleQuestion: editGame.single_question || '',
        singleQuestionOptions: parseArray(editGame.single_question_options) || ['', ''],
        singleQuestionCorrectAnswer: editGame.single_question_correct_answer || '',
        // Mitosis Sorting Game
        mitosisStageImages: mitosisStageImages,
        mitosisDescriptions: mitosisDescriptions,
        mitosisCorrectMatches: mitosisCorrectMatches,
        // Timeline Game
        timelineImages: parseArray(editGame.timeline_images) || [],
        timelineCorrectOrder: parseArray(editGame.timeline_correct_order) || [1, 2, 3, 4, 5],
        // Meiosis Fill-in-the-Blanks Game
        meiosisFillBlankQuestions: parseArray(editGame.meiosis_fill_blank_questions) || [
          {
            id: 1,
            question: "Meiosis ensures genetic ________ (diversity/duplication).",
            options: ["diversity", "duplication"],
            correct_answer: "diversity",
            explanation: "Meiosis creates genetic diversity through crossing-over and independent assortment."
          },
          {
            id: 2,
            question: "Meiosis creates ________ (haploid/diploid) cells, which are essential for sexual reproduction.",
            options: ["haploid", "diploid"],
            correct_answer: "haploid",
            explanation: "Meiosis reduces the chromosome number by half, creating haploid cells."
          },
          {
            id: 3,
            question: "The reduction in chromosome number during meiosis is crucial for ________ (maintaining/growing) the chromosome number of offspring.",
            options: ["maintaining", "growing"],
            correct_answer: "maintaining",
            explanation: "Meiosis maintains the chromosome number across generations by reducing it before fertilization."
          },
          {
            id: 4,
            question: "Meiosis leads to the production of genetically ________ (identical/unique) offspring.",
            options: ["identical", "unique"],
            correct_answer: "unique",
            explanation: "Meiosis produces genetically unique offspring through genetic recombination."
          },
          {
            id: 5,
            question: "Meiosis occurs in ________ (somatic/sex) cells.",
            options: ["somatic", "sex"],
            correct_answer: "sex",
            explanation: "Meiosis occurs in sex cells (gametes) to produce reproductive cells."
          },
          {
            id: 6,
            question: "Meiosis ensures that the chromosome number remains ________ (constant/variable) across generations.",
            options: ["constant", "variable"],
            correct_answer: "constant",
            explanation: "Meiosis maintains a constant chromosome number across generations."
          },
          {
            id: 7,
            question: "________ (Fertilization/Division) restores the diploid number of chromosomes after meiosis.",
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
            question: "Meiosis contributes to evolution by creating genetic ________ (stability/variation) through processes like crossing-over and independent assortment, leading to different combinations of genes.",
            options: ["stability", "variation"],
            correct_answer: "variation",
            explanation: "Meiosis creates genetic variation through crossing-over and independent assortment."
          }
        ],
        // Teacher Fill-in-the-Blanks Game
        teacherFillBlanksQuestions: parseArray(editGame.teacher_fill_blanks_questions) || [],
        teacherFillBlanksImages: parseArray(editGame.teacher_fill_blanks_images) || [],
        teacherFillBlanksCorrectAnswers: parseArray(editGame.teacher_fill_blanks_correct_answers) || [],
        // Shared
        wordAnswer: editGame.word_answer || '',
        vocabularyTerms: parseArray(editGame.vocabulary_terms) || [
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' }
        ],
        instructions: editGame.instructions || 'Complete both puzzles, answer the questions, then match vocabulary terms!'
      });

      // Load mitosis cards if they exist
      if (editGame.mitosis_cards) {
        const cards = parseArray(editGame.mitosis_cards);
        console.log('Loading mitosis cards:', cards);
        setMitosisCards(cards.map(card => ({
          ...card,
          imageFile: null,
          imagePreview: card.imageUrl || null
        })));
      }
    }
  }, [isEditMode, editGame]);

  // Add debugging for form rendering
  useEffect(() => {
    if (isEditMode) {
      console.log('🔍 Current gameData.mitosisDescriptions:', gameData.mitosisDescriptions);
      console.log('🔍 Current gameData.mitosisStageImages:', gameData.mitosisStageImages);
      console.log('🔍 Current gameData.mitosisCorrectMatches:', gameData.mitosisCorrectMatches);
    }
  }, [gameData.mitosisDescriptions, gameData.mitosisStageImages, gameData.mitosisCorrectMatches, isEditMode]);

  const handleImageUpload = (e, puzzleNumber = 1) => {
    const file = e.target.files[0];
    if (file) {
      if (puzzleNumber === 1) {
        setGameData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: URL.createObjectURL(file)
        }));
      } else if (puzzleNumber === 2) {
        setGameData(prev => ({
          ...prev,
          imageFile2: file,
          imagePreview2: URL.createObjectURL(file)
        }));
      } else if (puzzleNumber === 'single') {
        setGameData(prev => ({
          ...prev,
          singleImageFile: file,
          singleImagePreview: URL.createObjectURL(file)
        }));
      }
    }
  };

  const handleOptionChange = (index, value, puzzleNumber = 1) => {
    if (puzzleNumber === 1) {
      const newOptions = [...gameData.multipleChoiceOptions];
      newOptions[index] = value;
      setGameData(prev => ({
        ...prev,
        multipleChoiceOptions: newOptions
      }));
    } else if (puzzleNumber === 2) {
      const newOptions = [...gameData.multipleChoiceOptions2];
      newOptions[index] = value;
      setGameData(prev => ({
        ...prev,
        multipleChoiceOptions2: newOptions
      }));
    } else if (puzzleNumber === 'single') {
      const newOptions = [...gameData.singleQuestionOptions];
      newOptions[index] = value;
      setGameData(prev => ({
        ...prev,
        singleQuestionOptions: newOptions
      }));
    }
  };

  const handleVocabularyChange = (index, field, value) => {
    const newVocabularyTerms = [...gameData.vocabularyTerms];
    newVocabularyTerms[index] = {
      ...newVocabularyTerms[index],
      [field]: value
    };
    setGameData(prev => ({
      ...prev,
      vocabularyTerms: newVocabularyTerms
    }));
  };

  const addVocabularyPair = () => {
    const currentCount = gameData.vocabularyTerms.length;
    if (currentCount < 9) {
      setGameData(prev => ({
        ...prev,
        vocabularyTerms: [...prev.vocabularyTerms, { term: '', definition: '' }]
      }));
    }
  };

  const removeVocabularyPair = (index) => {
    const currentCount = gameData.vocabularyTerms.length;
    if (currentCount > 4) { // Keep minimum 4 pairs
      const newVocabularyTerms = gameData.vocabularyTerms.filter((_, i) => i !== index);
      setGameData(prev => ({
        ...prev,
        vocabularyTerms: newVocabularyTerms
      }));
    }
  };

  // Mitosis Sorting Game handlers
  const handleMitosisStageImageUpload = (stageIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const newStageImages = [...gameData.mitosisStageImages];
      newStageImages[stageIndex] = {
        file: file,
        preview: URL.createObjectURL(file)
      };
      setGameData(prev => ({
        ...prev,
        mitosisStageImages: newStageImages
      }));
    }
  };

  const handleMitosisDescriptionChange = (index, value) => {
    const newDescriptions = [...gameData.mitosisDescriptions];
    newDescriptions[index] = value;
    setGameData(prev => ({
      ...prev,
      mitosisDescriptions: newDescriptions
    }));
  };

  const handleMitosisMatchChange = (descriptionIndex, stageIndex) => {
    const newMatches = { ...gameData.mitosisCorrectMatches };
    newMatches[descriptionIndex] = stageIndex;
    setGameData(prev => ({
      ...prev,
      mitosisCorrectMatches: newMatches
    }));
  };

  const addMitosisDescription = () => {
    setGameData(prev => ({
      ...prev,
      mitosisDescriptions: [...prev.mitosisDescriptions, '']
    }));
  };

  const removeMitosisDescription = (index) => {
    const newDescriptions = gameData.mitosisDescriptions.filter((_, i) => i !== index);
    const newMatches = { ...gameData.mitosisCorrectMatches };
    delete newMatches[index];
    // Adjust indices for remaining matches
    Object.keys(newMatches).forEach(key => {
      const keyNum = parseInt(key);
      if (keyNum > index) {
        newMatches[keyNum - 1] = newMatches[keyNum];
        delete newMatches[keyNum];
      }
    });
    setGameData(prev => ({
      ...prev,
      mitosisDescriptions: newDescriptions,
      mitosisCorrectMatches: newMatches
    }));
  };

  // Teacher Fill-in-the-Blanks Game handlers
  const handleTeacherFillBlanksImageUpload = (imageIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...(gameData.teacherFillBlanksImages || [])];
      newImages[imageIndex] = { file, preview: URL.createObjectURL(file) };
      setGameData(prev => ({
        ...prev,
        teacherFillBlanksImages: newImages
      }));
    }
  };

  const handleTeacherFillBlanksQuestionChange = (questionIndex, field, value) => {
    const newQuestions = [...(gameData.teacherFillBlanksQuestions || [])];
    if (!newQuestions[questionIndex]) {
      newQuestions[questionIndex] = {
        question: '',
        text: '',
        blanks: []
      };
    }
    newQuestions[questionIndex][field] = value;
    setGameData(prev => ({
      ...prev,
      teacherFillBlanksQuestions: newQuestions
    }));
  };

  const handleTeacherFillBlanksBlankChange = (questionIndex, blankIndex, field, value) => {
    const newQuestions = [...(gameData.teacherFillBlanksQuestions || [])];
    if (!newQuestions[questionIndex]) {
      newQuestions[questionIndex] = {
        question: '',
        text: '',
        blanks: []
      };
    }
    if (!newQuestions[questionIndex].blanks[blankIndex]) {
      newQuestions[questionIndex].blanks[blankIndex] = {
        position: `[${blankIndex + 1}]`,
        answer: '',
        length: 5
      };
    }
    newQuestions[questionIndex].blanks[blankIndex][field] = value;
    setGameData(prev => ({
      ...prev,
      teacherFillBlanksQuestions: newQuestions
    }));
  };

  const addTeacherFillBlanksQuestion = () => {
    const newQuestions = [...(gameData.teacherFillBlanksQuestions || [])];
    newQuestions.push({
      question: '',
      text: '',
      blanks: []
    });
    setGameData(prev => ({
      ...prev,
      teacherFillBlanksQuestions: newQuestions
    }));
  };

  const removeTeacherFillBlanksQuestion = (questionIndex) => {
    const newQuestions = [...(gameData.teacherFillBlanksQuestions || [])];
    newQuestions.splice(questionIndex, 1);
    setGameData(prev => ({
      ...prev,
      teacherFillBlanksQuestions: newQuestions
    }));
  };

  const addTeacherFillBlanksBlank = (questionIndex) => {
    const newQuestions = [...(gameData.teacherFillBlanksQuestions || [])];
    if (!newQuestions[questionIndex]) {
      newQuestions[questionIndex] = {
        question: '',
        text: '',
        blanks: []
      };
    }
    const blankNumber = newQuestions[questionIndex].blanks.length + 1;
    newQuestions[questionIndex].blanks.push({
      position: `[${blankNumber}]`,
      answer: '',
      length: 5
    });
    setGameData(prev => ({
      ...prev,
      teacherFillBlanksQuestions: newQuestions
    }));
  };

  const removeTeacherFillBlanksBlank = (questionIndex, blankIndex) => {
    const newQuestions = [...(gameData.teacherFillBlanksQuestions || [])];
    if (newQuestions[questionIndex] && newQuestions[questionIndex].blanks) {
      newQuestions[questionIndex].blanks.splice(blankIndex, 1);
      // Update position numbers for remaining blanks
      newQuestions[questionIndex].blanks.forEach((blank, idx) => {
        blank.position = `[${idx + 1}]`;
      });
      setGameData(prev => ({
        ...prev,
        teacherFillBlanksQuestions: newQuestions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!gameData.question.trim()) {
        throw new Error('Please provide a question for puzzle 1');
      }
      if (!gameData.question2.trim()) {
        throw new Error('Please provide a question for puzzle 2');
      }
      if ((gameData.multipleChoiceOptions || []).some(opt => !opt.trim())) {
        throw new Error('Please fill in all multiple choice options for puzzle 1');
      }
      if ((gameData.multipleChoiceOptions2 || []).some(opt => !opt.trim())) {
        throw new Error('Please fill in all multiple choice options for puzzle 2');
      }
      if (!gameData.singleQuestion.trim()) {
        throw new Error('Please provide a question for the single image question');
      }
      if ((gameData.singleQuestionOptions || []).some(opt => !opt.trim())) {
        throw new Error('Please fill in all answer options for the single image question');
      }
      if (!gameData.singleQuestionCorrectAnswer.trim()) {
        throw new Error('Please select the correct answer for the single image question');
      }
      if (!gameData.wordAnswer.trim()) {
        throw new Error('Please provide the word answer');
      }
      if ((gameData.mitosisStageImages || []).length < 5) {
        throw new Error('Please upload all 5 stage images for the mitosis sorting game');
      }
      if ((gameData.mitosisDescriptions || []).length === 0) {
        throw new Error('Please add at least one description for the mitosis sorting game');
      }
      if (Object.keys(gameData.mitosisCorrectMatches || {}).length !== (gameData.mitosisDescriptions || []).length) {
        throw new Error('Please assign each description to a stage in the mitosis sorting game');
      }
      if ((gameData.timelineImages || []).length < 5) {
        throw new Error('Please upload at least 5 images for the timeline game');
      }

      // Teacher Fill-in-the-Blanks Game validation
      if ((gameData.teacherFillBlanksQuestions || []).length === 0) {
        throw new Error('Please add at least one question for the teacher fill-in-the-blanks game');
      }
      
      // Validate each question has required fields
      for (let i = 0; i < (gameData.teacherFillBlanksQuestions || []).length; i++) {
        const question = gameData.teacherFillBlanksQuestions[i];
        if (!question.question?.trim()) {
          throw new Error(`Please provide a question prompt for question ${i + 1}`);
        }
        if (!question.text?.trim()) {
          throw new Error(`Please provide text with blanks for question ${i + 1}`);
        }
        if ((question.blanks || []).length === 0) {
          throw new Error(`Please add at least one blank for question ${i + 1}`);
        }
        for (let j = 0; j < (question.blanks || []).length; j++) {
          const blank = question.blanks[j];
          if (!blank.answer?.trim()) {
            throw new Error(`Please provide an answer for blank ${j + 1} in question ${i + 1}`);
          }
        }
      }

      // Mitosis Card Game validation
      if (currentStep === 9 || gameData.gameType === 'mitosis_card') {
        if (mitosisCards.length < 3) {
          throw new Error('Please add at least 3 cards for the Mitosis Card Game.');
        }
      }

      // Validate images (required for create, optional for edit)
      if (!isEditMode) {
        if (!gameData.imageFile) {
          throw new Error('Please upload an image for puzzle 1');
        }
        if (!gameData.imageFile2) {
          throw new Error('Please upload an image for puzzle 2');
        }
        if (!gameData.singleImageFile) {
          throw new Error('Please upload an image for the single image question');
        }
        if ((gameData.mitosisStageImages || []).some(img => !img?.file)) {
          throw new Error('Please upload all 5 stage images for the mitosis sorting game');
        }
      }

      // Handle image uploads
      let imageUrl1 = editGame?.image_url || gameData.imagePreview;
      let imageUrl2 = editGame?.image_url_2 || gameData.imagePreview2;
      let singleImageUrl = editGame?.single_image_url || gameData.singleImagePreview;

      // Upload new image 1 if provided
      if (gameData.imageFile) {
      const { data: imageData1, error: uploadError1 } = await uploadImage(gameData.imageFile, 'puzzle-images');
      if (uploadError1) throw uploadError1;
        imageUrl1 = imageData1.publicUrl;
      }
      
      // Upload new image 2 if provided
      if (gameData.imageFile2) {
      const { data: imageData2, error: uploadError2 } = await uploadImage(gameData.imageFile2, 'puzzle-images');
      if (uploadError2) throw uploadError2;
        imageUrl2 = imageData2.publicUrl;
      }

      // Upload new single image if provided
      if (gameData.singleImageFile) {
        const { data: singleImageData, error: singleUploadError } = await uploadImage(gameData.singleImageFile, 'puzzle-images');
        if (singleUploadError) throw singleUploadError;
        singleImageUrl = singleImageData.publicUrl;
      }

      // Upload mitosis stage images
      let mitosisStageImageUrls = editGame?.mitosis_stage_images || [];
      for (let i = 0; i < (gameData.mitosisStageImages || []).length; i++) {
        const stageImage = gameData.mitosisStageImages[i];
        if (stageImage?.file) {
          const { data: stageImageData, error: stageUploadError } = await uploadImage(stageImage.file, 'puzzle-images');
          if (stageUploadError) throw stageUploadError;
          mitosisStageImageUrls[i] = stageImageData.publicUrl;
        } else if (stageImage?.preview && !isEditMode) {
          mitosisStageImageUrls[i] = stageImage.preview;
        }
      }

      // Upload mitosis stage images
      const mitosisStageUrls = [];
      for (let i = 0; i < 5; i++) {
        if (gameData.mitosisStageImages[i]?.file) {
          const { data: stageImageData, error: stageUploadError } = await uploadImage(gameData.mitosisStageImages[i].file, 'puzzle-images');
          if (stageUploadError) throw stageUploadError;
          mitosisStageUrls[i] = stageImageData.publicUrl;
        } else if (editGame?.mitosis_stage_images?.[i]) {
          mitosisStageUrls[i] = editGame.mitosis_stage_images[i];
        }
      }

      // Upload timeline images
      const timelineImageUrls = [];
      for (let i = 0; i < (gameData.timelineImages || []).length; i++) {
        const timelineImage = gameData.timelineImages[i];
        if (timelineImage?.file) {
          const { data: timelineImageData, error: timelineUploadError } = await uploadImage(timelineImage.file, 'puzzle-images');
          if (timelineUploadError) throw timelineUploadError;
          timelineImageUrls[i] = timelineImageData.publicUrl;
        } else if (editGame?.timeline_images?.[i]) {
          timelineImageUrls[i] = editGame.timeline_images[i];
        }
      }

      // Upload teacher fill-in-the-blanks images
      const teacherFillBlanksImageUrls = [];
      for (let i = 0; i < (gameData.teacherFillBlanksImages || []).length; i++) {
        const teacherImage = gameData.teacherFillBlanksImages[i];
        if (teacherImage?.file) {
          const { data: teacherImageData, error: teacherUploadError } = await uploadImage(teacherImage.file, 'puzzle-images');
          if (teacherUploadError) throw teacherUploadError;
          teacherFillBlanksImageUrls[i] = teacherImageData.publicUrl;
        } else if (editGame?.teacher_fill_blanks_images?.[i]) {
          teacherFillBlanksImageUrls[i] = editGame.teacher_fill_blanks_images[i];
        }
      }

      // Process teacher fill-in-the-blanks correct answers
      const teacherFillBlanksCorrectAnswers = (gameData.teacherFillBlanksQuestions || []).map(question => 
        (question.blanks || []).map(blank => blank.answer)
      );

      // Filter out empty vocabulary terms and validate
      const completedTerms = (gameData.vocabularyTerms || []).filter(term => 
        term.term.trim() && term.definition.trim()
      );
      if (completedTerms.length < 4) {
        throw new Error('Please provide at least 4 complete vocabulary term-definition pairs');
      }

      // Create game data object
      const gameToSave = {
        title: gameData.title,
        description: gameData.description,
        game_type: 'puzzle', // Default to puzzle type
        image_url: imageUrl1,
        image_url_2: imageUrl2,
        question: gameData.question,
        question_2: gameData.question2,
        multiple_choice_options: gameData.multipleChoiceOptions,
        multiple_choice_options_2: gameData.multipleChoiceOptions2,
        correct_answer_index: gameData.correctAnswerIndex,
        correct_answer_index_2: gameData.correctAnswerIndex2,
        single_image_url: singleImageUrl,
        single_question: gameData.singleQuestion,
        single_question_options: gameData.singleQuestionOptions,
        single_question_correct_answer: gameData.singleQuestionCorrectAnswer,
        mitosis_stage_images: mitosisStageUrls,
        mitosis_descriptions: gameData.mitosisDescriptions || [],
        mitosis_correct_matches: gameData.mitosisCorrectMatches || {},
        timeline_images: timelineImageUrls,
        timeline_correct_order: gameData.timelineCorrectOrder || [1, 2, 3, 4, 5],
        meiosis_fill_blank_questions: gameData.meiosisFillBlankQuestions || [],
        teacher_fill_blanks_questions: gameData.teacherFillBlanksQuestions || [],
        teacher_fill_blanks_images: teacherFillBlanksImageUrls,
        teacher_fill_blanks_correct_answers: teacherFillBlanksCorrectAnswers,
        teacher_fill_blanks_game_type: 'teacher-fill-blanks',
        word_answer: gameData.wordAnswer.toUpperCase(),
        vocabulary_terms: completedTerms,
        instructions: gameData.instructions,
        difficulty: 'medium',
        is_active: true
      };

      // In handleSubmit, before saving, process mitosisCards if this is a mitosis_card game
      // Check if we're on step 9 (mitosis cards tab) or if there are mitosis cards to save
      console.log('Processing mitosis cards:', { currentStep, gameType: gameData.gameType, mitosisCardsLength: mitosisCards.length });
      if (currentStep === 9 || gameData.gameType === 'mitosis_card' || mitosisCards.length > 0) {
        console.log('Processing mitosis cards for saving:', mitosisCards);
        // Upload images for new/edited cards
        const processedCards = [];
        for (let card of mitosisCards) {
          let imageUrl = card.image_url;
          if (card.imageFile) {
            const { data: uploadData, error: uploadError } = await uploadImage(card.imageFile, 'card-images');
            if (uploadError) throw uploadError;
            imageUrl = uploadData.publicUrl;
          } else if (!imageUrl && card.imagePreview) {
            // If editing and only imagePreview is present, use it
            imageUrl = card.imagePreview;
          }
          processedCards.push({
            question: card.question,
            correctAnswer: card.correctAnswer,
            image_url: imageUrl
          });
        }
        gameToSave.mitosis_cards = processedCards;
        console.log('Processed mitosis cards:', processedCards);
      }

      // Add subject_id for create mode
      if (!isEditMode) {
        gameToSave.subject_id = subjectId;
      }

      // Save to database
      let savedGame;
      if (isEditMode) {
        const { data, error } = await updatePuzzleGame(editGame.id, gameToSave);
        if (error) throw error;
        savedGame = data;
      } else {
        const { data, error } = await createPuzzleGame(gameToSave);
        if (error) throw error;
        savedGame = data;
      }

      // Notify parent component
      onGameCreated(savedGame[0]);
      
      // Reset form
      setGameData({
        title: '',
        description: '',
        gameType: 'puzzle',
        // Puzzle 1
        imageFile: null,
        imagePreview: null,
        question: '',
        multipleChoiceOptions: ['', '', '', ''],
        correctAnswerIndex: 0,
        // Puzzle 2
        imageFile2: null,
        imagePreview2: null,
        question2: '',
        multipleChoiceOptions2: ['', '', '', ''],
        correctAnswerIndex2: 0,
        // Single Image Question
        singleImageFile: null,
        singleImagePreview: null,
        singleQuestion: '',
        singleQuestionOptions: ['', ''],
        singleQuestionCorrectAnswer: '',
        // Mitosis Sorting Game
        mitosisStageImages: [],
        mitosisDescriptions: [],
        mitosisCorrectMatches: {},
        // Timeline Game
        timelineImages: [],
        timelineCorrectOrder: [1, 2, 3, 4, 5],
        // Meiosis Fill-in-the-Blanks Game
        meiosisFillBlankQuestions: [
          {
            id: 1,
            question: "Meiosis ensures genetic ___ (diversity/duplication).",
            options: ["diversity", "duplication"],
            correct_answer: "diversity",
            explanation: "Meiosis creates genetic diversity through crossing-over and independent assortment."
          },
          {
            id: 2,
            question: "Meiosis creates ___ (haploid/diploid) cells, which are essential for sexual reproduction.",
            options: ["haploid", "diploid"],
            correct_answer: "haploid",
            explanation: "Meiosis reduces the chromosome number by half, creating haploid cells."
          },
          {
            id: 3,
            question: "The reduction in chromosome number during meiosis is crucial for ___ (maintaining/growing) the chromosome number of offspring.",
            options: ["maintaining", "growing"],
            correct_answer: "maintaining",
            explanation: "Meiosis maintains the chromosome number across generations by reducing it before fertilization."
          },
          {
            id: 4,
            question: "Meiosis leads to the production of genetically ___ (identical/unique) offspring.",
            options: ["identical", "unique"],
            correct_answer: "unique",
            explanation: "Meiosis produces genetically unique offspring through genetic recombination."
          },
          {
            id: 5,
            question: "Meiosis occurs in ___ (somatic/sex) cells.",
            options: ["somatic", "sex"],
            correct_answer: "sex",
            explanation: "Meiosis occurs in sex cells (gametes) to produce reproductive cells."
          },
          {
            id: 6,
            question: "Meiosis ensures that the chromosome number remains ___ (constant/variable) across generations.",
            options: ["constant", "variable"],
            correct_answer: "constant",
            explanation: "Meiosis maintains a constant chromosome number across generations."
          },
          {
            id: 7,
            question: "___ (Fertilization/Division) restores the diploid number of chromosomes after meiosis.",
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
            question: "Meiosis contributes to evolution by creating genetic ___ (stability/variation) through processes like crossing-over and independent assortment, leading to different combinations of genes.",
            options: ["stability", "variation"],
            correct_answer: "variation",
            explanation: "Meiosis creates genetic variation through crossing-over and independent assortment."
          }
        ],
        // Teacher Fill-in-the-Blanks Game
        teacherFillBlanksQuestions: [],
        teacherFillBlanksImages: [],
        teacherFillBlanksCorrectAnswers: [],
        // Shared
        wordAnswer: '',
        vocabularyTerms: [
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' }
        ],
        instructions: 'Complete both puzzles, answer questions, then match vocabulary terms!'
      });
      setMitosisCards([]); // Reset mitosis cards
      setCurrentStep(1);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 10) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content game-creation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Game' : 'Create Game'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Puzzle 1</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Question 1</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Puzzle 2</div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4. Question 2</div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>5. Single Image Q</div>
          <div className={`step ${currentStep >= 6 ? 'active' : ''}`}>6. Vocabulary</div>
          <div className={`step ${currentStep >= 7 ? 'active' : ''}`}>7. Mitosis Sorting</div>
          <div className={`step ${currentStep >= 8 ? 'active' : ''}`}>8. Timeline Game</div>
          <div className={`step ${currentStep >= 9 ? 'active' : ''}`}>9. Teacher Fill Blanks</div>
          <div className={`step ${currentStep >= 10 ? 'active' : ''}`}>10. Review</div>
        </div>

        <form onSubmit={handleSubmit} className="game-form">
          {/* Step 1: Game Info & Puzzle 1 */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label>Game Title</label>
                <input
                  type="text"
                  value={gameData.title}
                  onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Cell Division Dual Puzzle"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={gameData.description}
                  onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what students will learn with both puzzles..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Puzzle 1 Image</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 1)}
                    className="image-input"
                    required
                  />
                  {gameData.imagePreview && (
                    <div className="image-preview">
                      <img src={gameData.imagePreview} alt="Puzzle 1 preview" />
                      <p>This image will be divided into a 4x4 puzzle grid (Puzzle 1)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Question 1 */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="form-group">
                <label>Question 1 (after puzzle 1 completion)</label>
                <textarea
                  value={gameData.question}
                  onChange={(e) => setGameData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="e.g., What biological process does this image represent?"
                  rows="2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Multiple Choice Options for Question 1</label>
                {(gameData.multipleChoiceOptions || []).map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value, 1)}
                      placeholder={`Option ${index + 1} (e.g., ${index === 0 ? 'Mitosis' : 'Meiosis'})`}
                      required
                    />
                    <input
                      type="radio"
                      name="correctAnswer1"
                      checked={gameData.correctAnswerIndex === index}
                      onChange={() => setGameData(prev => ({ ...prev, correctAnswerIndex: index }))}
                      title="Correct answer for Question 1"
                    />
                  </div>
                ))}
                <small>Select the radio button next to the correct answer for Question 1</small>
              </div>
            </div>
          )}

          {/* Step 3: Puzzle 2 */}
          {currentStep === 3 && (
            <div className="step-content">
              <div className="form-group">
                <label>Puzzle 2 Image</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 2)}
                    className="image-input"
                    required
                  />
                  {gameData.imagePreview2 && (
                    <div className="image-preview">
                      <img src={gameData.imagePreview2} alt="Puzzle 2 preview" />
                      <p>This image will be divided into a 4x4 puzzle grid (Puzzle 2)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Question 2 */}
          {currentStep === 4 && (
            <div className="step-content">
              <div className="form-group">
                <label>Question 2 (after puzzle 2 completion)</label>
                <textarea
                  value={gameData.question2}
                  onChange={(e) => setGameData(prev => ({ ...prev, question2: e.target.value }))}
                  placeholder="e.g., How does this process differ from the first image?"
                  rows="2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Multiple Choice Options for Question 2</label>
                {(gameData.multipleChoiceOptions2 || []).map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value, 2)}
                      placeholder={`Option ${index + 1} (e.g., ${index === 0 ? 'Different stages' : 'Same process'})`}
                      required
                    />
                    <input
                      type="radio"
                      name="correctAnswer2"
                      checked={gameData.correctAnswerIndex2 === index}
                      onChange={() => setGameData(prev => ({ ...prev, correctAnswerIndex2: index }))}
                      title="Correct answer for Question 2"
                    />
                  </div>
                ))}
                <small>Select the radio button next to the correct answer for Question 2</small>
              </div>
            </div>
          )}

          {/* Step 5: Single Image Question */}
          {currentStep === 5 && (
            <div className="step-content">
              <div className="form-group">
                <label>Single Image Question (appears after combined analysis)</label>
                <p className="step-description">
                  This question will appear after the combined analysis question. Students will see one image and answer a fill-in-the-blank question.
                </p>
              </div>

              <div className="form-group">
                <label>Single Image</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'single')}
                    className="image-input"
                    required
                  />
                  {gameData.singleImagePreview && (
                    <div className="image-preview">
                      <img src={gameData.singleImagePreview} alt="Single image preview" />
                      <p>This image will be shown with the question</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Question Text (fill-in-the-blank format)</label>
                <textarea
                  value={gameData.singleQuestion}
                  onChange={(e) => setGameData(prev => ({ ...prev, singleQuestion: e.target.value }))}
                  placeholder="e.g., _________ is the division of cells in the reproductive process."
                  rows="2"
                  required
                />
                <small>Use underscores (_____) to indicate where the answer should be placed</small>
              </div>

              <div className="form-group">
                <label>Answer Options (drag-and-drop choices)</label>
                {gameData.singleQuestionOptions.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value, 'single')}
                      placeholder={`Option ${index + 1} (e.g., ${index === 0 ? 'MITOSIS' : 'MEIOSIS'})`}
                      required
                    />
                    <input
                      type="radio"
                      name="singleCorrectAnswer"
                      checked={gameData.singleQuestionCorrectAnswer === option}
                      onChange={() => setGameData(prev => ({ ...prev, singleQuestionCorrectAnswer: option }))}
                      title="Correct answer for single image question"
                    />
                  </div>
                ))}
                <small>Select the radio button next to the correct answer</small>
              </div>
            </div>
          )}

          {/* Step 6: Vocabulary Terms */}
          {currentStep === 6 && (
            <div className="step-content">
              <div className="form-group">
                <label>Word Answer (for vocabulary completion)</label>
                <input
                  type="text"
                  value={gameData.wordAnswer}
                  onChange={(e) => setGameData(prev => ({ ...prev, wordAnswer: e.target.value }))}
                  placeholder="e.g., MITOSIS"
                  required
                />
                <small>Students will use this word for vocabulary completion</small>
              </div>

              <div className="form-group vocabulary-form-group">
                <label>Vocabulary Terms (minimum 4 pairs, maximum 9 pairs)</label>
                <div className="vocabulary-counter">
                  <span>Showing {gameData.vocabularyTerms?.length || 0} vocabulary pairs</span>
                  <span className="scroll-hint">↓ Scroll down to see all 9 pairs ↓</span>
                </div>
                {(gameData.vocabularyTerms || []).map((term, index) => (
                  <div key={index} className="vocabulary-pair">
                    <div className="pair-number">Pair {index + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeVocabularyPair(index)}
                      className="remove-pair-btn"
                      title="Remove this pair"
                      disabled={gameData.vocabularyTerms.length <= 4}
                    >
                      ×
                    </button>
                    <input
                      type="text"
                      value={term.term}
                      onChange={(e) => handleVocabularyChange(index, 'term', e.target.value)}
                      placeholder={`Term ${index + 1} (e.g., ${index === 0 ? 'MITOSIS' : index === 1 ? 'CYTOKINESIS' : index === 2 ? 'CENTROSOME' : 'SPINDLE'})`}
                    />
                    <textarea
                      value={term.definition}
                      onChange={(e) => handleVocabularyChange(index, 'definition', e.target.value)}
                      placeholder={`Definition ${index + 1}`}
                      rows="2"
                    />
                  </div>
                ))}
                {gameData.vocabularyTerms.length < 9 && (
                  <button
                    type="button"
                    onClick={addVocabularyPair}
                    className="add-pair-btn"
                  >
                    + Add Vocabulary Pair
                  </button>
                )}
                <small>Fill in at least 4 term-definition pairs (up to 9 pairs) for the vocabulary matching game</small>
              </div>

              <div className="form-group">
                <label>Game Instructions</label>
                <textarea
                  value={gameData.instructions}
                  onChange={(e) => setGameData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows="2"
                />
              </div>
            </div>
          )}

                    {/* Step 7: Mitosis Sorting Game */}
          {currentStep === 7 && (
            <div className="step-content">
              <div className="form-group">
                <label>Mitosis Sorting Game</label>
                <p className="step-description">
                  Create a drag-and-drop sorting game where students match descriptions to the correct mitosis stages.
                </p>
              </div>

              <div className="form-group">
                <label>Stage Images (5 stages in a row)</label>
                <div className="mitosis-stages-grid">
                  {[0, 1, 2, 3, 4].map((stageIndex) => (
                    <div key={stageIndex} className="stage-upload-item">
                      <div className="image-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMitosisStageImageUpload(stageIndex, e)}
                          className="image-input"
                          required
                        />
                        {gameData.mitosisStageImages[stageIndex]?.preview && (
                          <div className="image-preview">
                            <img src={gameData.mitosisStageImages[stageIndex].preview} alt="" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Descriptions to Drag</label>
                <div className="descriptions-container">
                  {console.log('🔍 Rendering mitosis descriptions:', gameData.mitosisDescriptions)}
                  {(gameData.mitosisDescriptions || []).map((description, index) => (
                    <div key={index} className="description-item">
                      <div className="description-input">
                        <input
                          type="text"
                          value={description || ''}
                          onChange={(e) => handleMitosisDescriptionChange(index, e.target.value)}
                          placeholder={`Description ${index + 1} (e.g., "Chromosomes align at equator")`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeMitosisDescription(index)}
                          className="remove-btn"
                          title="Remove description"
                        >
                          ×
                        </button>
                      </div>
                      <div className="match-selector">
                        <label>Matches Image:</label>
                        <select
                          value={gameData.mitosisCorrectMatches[index] ?? ''}
                          onChange={(e) => handleMitosisMatchChange(index, parseInt(e.target.value))}
                          required
                        >
                          <option value="">Select image...</option>
                          {[0, 1, 2, 3, 4].map((stageIndex) => (
                            <option key={stageIndex} value={stageIndex}>
                              Image {stageIndex + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMitosisDescription}
                    className="add-description-btn"
                  >
                    + Add Description
                  </button>
                </div>
                <small>Add descriptions that students will drag to the correct stages. Use the dropdown to specify which image is the correct match for each description. Multiple descriptions can match the same image.</small>
              </div>
            </div>
          )}

          {/* Step 8: Timeline Game Creation */}
          {currentStep === 8 && (
            <div className="step-content">
              <div className="form-group">
                <label>Timeline Game: Upload Images</label>
                <p className="step-description">
                  Upload 5 images for the timeline sequencing game. You can upload extra images as distractors.
                </p>
                
                {/* Individual upload buttons with improved spacing */}
                <div className="timeline-upload-section">
                  <div className="timeline-upload-grid">
                    {[0, 1, 2, 3, 4].map((imageIndex) => (
                      <div key={imageIndex} className="timeline-upload-card">
                        <div className="upload-card-header">
                          <span className="upload-number">{imageIndex + 1}</span>
                          <label>Upload Image {imageIndex + 1}</label>
                        </div>
                        <div className="upload-card-content">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const newImages = [...(gameData.timelineImages || [])];
                                newImages[imageIndex] = { file, preview: URL.createObjectURL(file) };
                                setGameData(prev => ({
                                  ...prev,
                                  timelineImages: newImages
                                }));
                              }
                            }}
                            className="timeline-image-input"
                            id={`timeline-upload-${imageIndex}`}
                          />
                          <label htmlFor={`timeline-upload-${imageIndex}`} className="upload-button">
                            <span className="upload-icon">📁</span>
                            <span>Choose File</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image previews with timeline frame design */}
                <div className="timeline-preview-section">
                  <h4>📸 Uploaded Images Preview</h4>
                  <div className="timeline-frame">
                    <div className="timeline-frame-header">
                      <div className="timeline-frame-title">Images to Arrange</div>
                      <div className="timeline-frame-subtitle">These will be shown to students for dragging</div>
                    </div>
                    <div className="timeline-images-showcase">
                      {(gameData.timelineImages || []).map((img, idx) => (
                        <div key={idx} className="timeline-showcase-card">
                          <div className="showcase-image-container">
                            <img src={img.preview || img} alt={`Timeline ${idx + 1}`} />
                          </div>
                          <div className="showcase-label">Image {idx + 1}</div>
                        </div>
                      ))}
                      {(gameData.timelineImages || []).length === 0 && (
                        <div className="timeline-empty-state">
                          <div className="empty-icon">📷</div>
                          <p>No images uploaded yet</p>
                          <small>Upload at least 5 images to create the timeline game</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <small>Upload at least 5 images. You can upload more to act as distractors.</small>
              </div>

              {/* Timeline order selection with improved design */}
              <div className="form-group">
                <label>Set the Correct Timeline Order</label>
                <div className="timeline-order-section">
                  <div className="timeline-order-frame">
                    <div className="timeline-order-header">
                      <div className="timeline-order-title">⏰ Timeline Sequence</div>
                      <div className="timeline-order-subtitle">Drag images to arrange in chronological order</div>
                    </div>
                    <div className="timeline-order-container">
                      {[0, 1, 2, 3, 4].map((slotIdx) => (
                        <div key={slotIdx} className="timeline-order-slot">
                          <div className="order-slot-header">
                            <div className="order-slot-number">{slotIdx + 1}</div>
                            <div className="order-slot-label">Position</div>
                          </div>
                          <div className="order-slot-content">
                            <select
                              value={gameData.timelineCorrectOrder[slotIdx] ?? ''}
                              onChange={e => {
                                const newOrder = [...gameData.timelineCorrectOrder];
                                newOrder[slotIdx] = parseInt(e.target.value);
                                setGameData(prev => ({ ...prev, timelineCorrectOrder: newOrder }));
                              }}
                              required
                              className="timeline-order-select"
                            >
                              <option value="">Select image...</option>
                              {(gameData.timelineImages || []).map((img, idx) => (
                                <option key={idx} value={idx + 1}>
                                  Image {idx + 1}
                                </option>
                              ))}
                            </select>
                            {/* Show thumbnail preview for selected image */}
                            {gameData.timelineImages[gameData.timelineCorrectOrder[slotIdx] - 1] && (
                              <div className="timeline-selected-preview">
                                <img
                                  src={gameData.timelineImages[gameData.timelineCorrectOrder[slotIdx] - 1].preview || gameData.timelineImages[gameData.timelineCorrectOrder[slotIdx] - 1]}
                                  alt="Selected"
                                />
                              </div>
                            )}
                          </div>
                          {slotIdx < 4 && <div className="timeline-arrow-large">→</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <small>For each timeline position, select which image is the correct answer.</small>
              </div>
            </div>
          )}

          {/* Step 9: Teacher Fill-in-the-Blanks Game & Mitosis Cards */}
          {currentStep === 9 && (
            <div className="step-content">
              {/* Tab Navigation */}
              <div className="step-tabs">
                <button
                  type="button"
                  className={`step-tab ${activeTab === 'teacher-fill-blanks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('teacher-fill-blanks')}
                >
                  📝 Teacher Fill-in-the-Blanks
                </button>
                <button
                  type="button"
                  className={`step-tab ${activeTab === 'mitosis-cards' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('mitosis-cards');
                    setGameData(prev => ({ ...prev, gameType: 'mitosis_card' }));
                  }}
                >
                  🧬 Mitosis Cards
                </button>
              </div>

              {/* Teacher Fill-in-the-Blanks Tab */}
              {activeTab === 'teacher-fill-blanks' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label>Teacher Fill-in-the-Blanks Game</label>
                    <p className="step-description">
                      Create custom fill-in-the-blanks questions with your own images and text. Use numbered placeholders like [1], [2], etc. in your text.
                    </p>
                  </div>

                  <div className="form-group">
                    <label>Upload Images (Optional)</label>
                    <div className="teacher-fill-blanks-images-grid">
                      {[0, 1, 2].map((imageIndex) => (
                        <div key={imageIndex} className="teacher-fill-blanks-image-upload">
                          <div className="image-upload-area">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleTeacherFillBlanksImageUpload(imageIndex, e)}
                              className="image-input"
                            />
                            {gameData.teacherFillBlanksImages[imageIndex]?.preview && (
                              <div className="image-preview">
                                <img src={gameData.teacherFillBlanksImages[imageIndex].preview} alt={`Image ${imageIndex + 1}`} />
                              </div>
                            )}
                          </div>
                          <small>Image {imageIndex + 1} (optional)</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Questions</label>
                    <div className="teacher-fill-blanks-questions">
                      {(gameData.teacherFillBlanksQuestions || []).map((question, questionIndex) => (
                        <div key={questionIndex} className="teacher-fill-blanks-question-card">
                          <div className="question-header">
                            <h4>Question {questionIndex + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeTeacherFillBlanksQuestion(questionIndex)}
                              className="remove-btn"
                              title="Remove question"
                            >
                              ×
                            </button>
                          </div>
                          
                          <div className="question-content">
                            <div className="form-group">
                              <label>Question Prompt</label>
                              <textarea
                                value={question.question || ''}
                                onChange={(e) => handleTeacherFillBlanksQuestionChange(questionIndex, 'question', e.target.value)}
                                placeholder="e.g., Think about how plants grow in your garden. How do you think mitosis helps in the growth of a plant from seed?"
                                rows="2"
                              />
                            </div>

                            <div className="form-group">
                              <label>Text with Blanks</label>
                              <textarea
                                value={question.text || ''}
                                onChange={(e) => handleTeacherFillBlanksQuestionChange(questionIndex, 'text', e.target.value)}
                                placeholder="e.g., When a seed grows into a plant, mitosis helps the cells [1] and [2], creating new cells that allow the plant to grow taller, develop leaves, and even sprout flowers or fruits. Mitosis is key to the [3] of every plant."
                                rows="3"
                              />
                              <small>Use [1], [2], [3], etc. to mark where blanks should appear</small>
                            </div>

                            <div className="form-group">
                              <label>Blanks</label>
                              <div className="blanks-container">
                                {(question.blanks || []).map((blank, blankIndex) => (
                                  <div key={blankIndex} className="blank-item">
                                    <div className="blank-header">
                                      <span>Blank {blankIndex + 1} ({blank.position})</span>
                                      <button
                                        type="button"
                                        onClick={() => removeTeacherFillBlanksBlank(questionIndex, blankIndex)}
                                        className="remove-btn small"
                                        title="Remove blank"
                                      >
                                        ×
                                      </button>
                                    </div>
                                    <div className="blank-inputs">
                                      <input
                                        type="text"
                                        value={blank.answer || ''}
                                        onChange={(e) => handleTeacherFillBlanksBlankChange(questionIndex, blankIndex, 'answer', e.target.value)}
                                        placeholder="Correct answer"
                                        required
                                      />
                                      <input
                                        type="number"
                                        value={blank.length || 5}
                                        onChange={(e) => handleTeacherFillBlanksBlankChange(questionIndex, blankIndex, 'length', parseInt(e.target.value))}
                                        placeholder="Length"
                                        min="1"
                                        max="20"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addTeacherFillBlanksBlank(questionIndex)}
                                  className="add-blank-btn"
                                >
                                  + Add Blank
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTeacherFillBlanksQuestion}
                        className="add-question-btn"
                      >
                        + Add Question
                      </button>
                    </div>
                    <small>Add questions with numbered blanks. Students will see the first letter of each answer as a hint.</small>
                  </div>
                </div>
              )}

              {/* Mitosis Cards Tab */}
              {activeTab === 'mitosis-cards' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label>Add Mitosis Cards (unlimited)</label>
                    <p className="step-description">
                      Create mitosis cards for students to determine if changes are significant or not significant.
                    </p>
                  </div>
                  
                  {/* Existing Cards Display */}
                  {console.log('Rendering mitosis cards:', mitosisCards)}
                  {mitosisCards.length > 0 && (
                    <div className="form-group">
                      <label>Existing Cards ({mitosisCards.length})</label>
                      <div className="mitosis-cards-list">
                        {mitosisCards.map((card, idx) => (
                          <div key={idx} className="mitosis-card-item">
                            <div className="mitosis-card-image">
                              <img 
                                src={card.imagePreview || card.image_url} 
                                alt="Card preview" 
                                className="mitosis-card-thumb" 
                              />
                            </div>
                            <div className="mitosis-card-info">
                              <div className="card-description">
                                <strong>Description:</strong> {card.question}
                              </div>
                              <div className="card-answer">
                                <strong>Answer:</strong> 
                                <span className={`answer-badge ${card.correctAnswer === 'significant' ? 'significant' : 'not-significant'}`}>
                                  {card.correctAnswer === 'significant' ? 'Significant' : 'Not Significant'}
                                </span>
                              </div>
                            </div>
                            <div className="mitosis-card-actions">
                              <button 
                                type="button" 
                                className="edit-card-btn"
                                onClick={() => {
                                  setEditingCardIndex(idx);
                                  setNewCard({...card});
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                type="button" 
                                className="remove-card-btn"
                                onClick={() => setMitosisCards(mitosisCards.filter((_, i) => i !== idx))}
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add New Card Form */}
                  <div className="form-group">
                    <label>{editingCardIndex !== null ? 'Edit Card' : 'Add New Card'}</label>
                    <div className="mitosis-card-form">
                      <div className="form-row">
                        <div className="form-col">
                          <label>Card Image</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) setNewCard(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
                            }} 
                            className="file-input"
                          />
                          {newCard.imagePreview && (
                            <div className="image-preview">
                              <img src={newCard.imagePreview} alt="Preview" />
                            </div>
                          )}
                        </div>
                        <div className="form-col">
                          <label>Description</label>
                          <input 
                            type="text" 
                            placeholder="Enter card description..." 
                            value={newCard.question} 
                            onChange={e => setNewCard(prev => ({ ...prev, question: e.target.value }))} 
                            className="description-input"
                          />
                        </div>
                        <div className="form-col">
                          <label>Correct Answer</label>
                          <select 
                            value={newCard.correctAnswer} 
                            onChange={e => setNewCard(prev => ({ ...prev, correctAnswer: e.target.value }))}
                            className="answer-select"
                          >
                            <option value="significant">Significant</option>
                            <option value="not significant">Not Significant</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="add-card-btn"
                          onClick={() => {
                            if (!newCard.imageFile && !newCard.imagePreview && !newCard.image_url) {
                              alert('Please select an image for the card');
                              return;
                            }
                            if (!newCard.question.trim()) {
                              alert('Please enter a description for the card');
                              return;
                            }
                            if (editingCardIndex !== null) {
                              const updated = [...mitosisCards];
                              updated[editingCardIndex] = newCard;
                              setMitosisCards(updated);
                              setEditingCardIndex(null);
                            } else {
                              setMitosisCards([...mitosisCards, newCard]);
                            }
                            setNewCard({ imageFile: null, imagePreview: null, question: '', correctAnswer: 'significant' });
                          }}
                        >
                          {editingCardIndex !== null ? 'Update Card' : 'Add Card'}
                        </button>
                        {editingCardIndex !== null && (
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => { 
                              setEditingCardIndex(null); 
                              setNewCard({ imageFile: null, imagePreview: null, question: '', correctAnswer: 'significant' }); 
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <small>Add as many cards as you want. At least 3 are required to save the game.</small>
                </div>
              )}
            </div>
          )}

          {/* Step 10: Review & Create */}
          {currentStep === 10 && (
            <div className="step-content">
              <div className="game-preview">
                <h4>🎮 Dual Puzzle Game Preview:</h4>
                
                <div className="preview-images">
                  <div className="preview-image-item">
                    <img src={gameData.imagePreview} alt="Puzzle Image 1" />
                    <label>📸 Puzzle 1 Image</label>
                  </div>
                  <div className="preview-image-item">
                    <img src={gameData.imagePreview2} alt="Puzzle Image 2" />
                    <label>📸 Puzzle 2 Image</label>
                  </div>
                  <div className="preview-image-item">
                    <img src={gameData.singleImagePreview} alt="Single Image" />
                    <label>📸 Single Image Question</label>
                  </div>
                </div>
                
                <div className="preview-summary">
                  <p><strong>🎯 Title:</strong> {gameData.title}</p>
                  <p><strong>📝 Description:</strong> {gameData.description}</p>
                  <p><strong>❓ Question 1:</strong> {gameData.question}</p>
                  <p><strong>✅ Answer 1:</strong> {gameData.multipleChoiceOptions[gameData.correctAnswerIndex]}</p>
                  <p><strong>❓ Question 2:</strong> {gameData.question2}</p>
                  <p><strong>✅ Answer 2:</strong> {gameData.multipleChoiceOptions2[gameData.correctAnswerIndex2]}</p>
                  <p><strong>❓ Single Image Question:</strong> {gameData.singleQuestion}</p>
                  <p><strong>✅ Single Image Answer:</strong> {gameData.singleQuestionCorrectAnswer}</p>
                  <p><strong>🔤 Word Answer:</strong> {gameData.wordAnswer}</p>
                  <p><strong>🔓 Vocabulary Terms:</strong> {(gameData.vocabularyTerms || []).filter(t => t.term && t.definition).length} pairs</p>
                  <p><strong>🧬 Mitosis Stages:</strong> {(gameData.mitosisStageImages || []).filter(img => img).length}/5 uploaded</p>
                  <p><strong>📝 Mitosis Descriptions:</strong> {(gameData.mitosisDescriptions || []).filter(d => d.trim()).length} descriptions</p>
                  <p><strong>⏰ Timeline Images:</strong> {(gameData.timelineImages || []).filter(img => img).length}/5 uploaded</p>
                  <p><strong>📝 Teacher Fill Blanks Questions:</strong> {(gameData.teacherFillBlanksQuestions || []).length} questions</p>
                  <p><strong>🖼️ Teacher Fill Blanks Images:</strong> {(gameData.teacherFillBlanksImages || []).filter(img => img).length} uploaded</p>
                </div>
                
                <div className="game-flow-preview">
                  <h5>🎮 Student Game Flow:</h5>
                  <ol>
                    <li>🧩 Complete Puzzle 1 → Answer Question 1</li>
                    <li>🧩 Complete Puzzle 2 → Answer Question 2</li>
                    <li>🔬 Combined Analysis Question</li>
                    <li>📸 Single Image Question</li>
                    <li>🔓 Match Vocabulary Terms</li>
                    <li>🧬 Mitosis Sorting Game</li>
                    <li>⏰ Timeline Sequencing Game</li>
                    <li>📝 Teacher Fill-in-the-Blanks Game</li>
                    <li>🏆 See Final Results</li>
                  </ol>
                </div>
              </div>
            </div>
          )}



          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                ← Previous
              </button>
            )}
            
            {currentStep < 10 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next →
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (isEditMode ? 'Updating Game...' : 'Creating Game...') : (isEditMode ? 'Update Puzzle Game' : 'Create Puzzle Game')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameCreationModal; 