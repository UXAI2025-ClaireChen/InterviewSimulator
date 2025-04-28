import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { fetchQuestions } from '../api/openai';
import { defaultQuestions } from '../data/defaultQuestions';

/**
 * Custom hook for managing interview questions
 * @param {string} initialTopic - Initial topic to load
 * @returns {Object} Question management methods and state
 */

const useQuestionManager = (initialTopic = 'Teamwork') => {
  // State
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [apiQuestions, setApiQuestions] = useState({});
  const [usedQuestionIndices, setUsedQuestionIndices] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  // Chakra UI toast
  const toast = useToast();

  /**
   * Get questions for the current topic
   * @returns {string[]} Array of questions
   */
  const getTopicQuestions = useCallback(() => {
    // If we have API questions for this topic, use those
    if (apiQuestions[selectedTopic] && apiQuestions[selectedTopic].length > 0) {
      return apiQuestions[selectedTopic];
    }
    
    // Otherwise use default questions
    return defaultQuestions[selectedTopic] || [];
  }, [apiQuestions, selectedTopic]);

  /**
   * Fetch questions from API for a specific topic
   * @param {string} topic - Topic to fetch questions for
   */
  const loadQuestions = useCallback(async (topic) => {
    // Clear current question immediately to prevent showing the previous question
    setCurrentQuestion('');
    setIsLoadingQuestions(true);
    
    try {
      // Call OpenAI API
      const questions = await fetchQuestions(topic);
      
      // Update questions and reset used indices
      setApiQuestions(prev => ({
        ...prev,
        [topic]: questions
      }));
      
      // Reset used question indices for this topic
      setUsedQuestionIndices(prev => ({
        ...prev,
        [topic]: []
      }));
      
      // Toast notifications commented out as requested
      // toast({
      //   title: 'Questions loaded',
      //   description: `New ${topic} questions are ready`,
      //   status: 'success',
      //   duration: 2000,
      //   isClosable: true,
      // });
      
      // After getting new questions, automatically select one
      setTimeout(() => selectRandomQuestion(), 100);
    } catch (error) {
      console.error(`Error fetching ${topic} interview questions:`, error);
      
      // Fallback to default questions if API fails
      setApiQuestions(prev => ({
        ...prev,
        [topic]: defaultQuestions[topic] || []
      }));
      
      setUsedQuestionIndices(prev => ({
        ...prev,
        [topic]: []
      }));
      
      // Toast notifications commented out as requested
      // toast({
      //   title: 'Error loading questions',
      //   description: 'Using default questions instead',
      //   status: 'warning',
      //   duration: 3000,
      //   isClosable: true,
      // });
      
      // Select a default question
      setTimeout(() => selectRandomQuestion(), 100);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [toast]);

  const setCustomQuestion = (question) => {
    setCurrentQuestion(question);
  };
  
  /**
   * Select a random question from the current topic
   */
  const selectRandomQuestion = useCallback(() => {
    // Clear current question immediately to prevent showing the previous question
    setCurrentQuestion('');
    
    const questions = getTopicQuestions();
    
    // Check if all questions have been used
    const usedIndices = usedQuestionIndices[selectedTopic] || [];
    if (usedIndices.length >= questions.length) {
      // If all questions have been used, fetch new questions
      loadQuestions(selectedTopic);
      return;
    }
    
    // Find an unused question index
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (usedIndices.includes(randomIndex) && usedIndices.length < questions.length);
    
    // Mark this question as used
    setUsedQuestionIndices(prev => ({
      ...prev,
      [selectedTopic]: [...(prev[selectedTopic] || []), randomIndex]
    }));
    
    setCurrentQuestion(questions[randomIndex]);
  }, [getTopicQuestions, loadQuestions, selectedTopic, usedQuestionIndices]);

  /**
   * Handle topic change
   * @param {string} newTopic - New topic to switch to
   */
  const changeTopic = useCallback((newTopic) => {
    // Clear current question immediately to prevent showing the previous question
    setCurrentQuestion('');
    setSelectedTopic(newTopic);
    
    // Check if we already have questions for this topic
    if (!apiQuestions[newTopic] || apiQuestions[newTopic].length === 0) {
      // Fetch questions for this topic if we don't have them yet
      loadQuestions(newTopic);
    } else {
      // If we already have questions, just select a random one
      setTimeout(() => selectRandomQuestion(), 10);
    }
  }, [apiQuestions, loadQuestions, selectRandomQuestion]);

  // Load questions for the initial topic on mount
  useEffect(() => {
    if (!apiQuestions[selectedTopic]) {
      loadQuestions(selectedTopic);
    }
  }, [loadQuestions, selectedTopic, apiQuestions]);

  // Select a random question when API questions are loaded
  useEffect(() => {
    if (apiQuestions[selectedTopic]?.length > 0 && !currentQuestion && !isLoadingQuestions) {
      selectRandomQuestion();
    }
  }, [apiQuestions, selectedTopic, currentQuestion, isLoadingQuestions, selectRandomQuestion]);

  return {
    // State
    selectedTopic,
    currentQuestion,
    isLoadingQuestions,
    
    // Methods
    changeTopic,
    selectRandomQuestion,
    setCustomQuestion
  };
};

export default useQuestionManager;