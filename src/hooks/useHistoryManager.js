import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

/**
 * Custom hook for managing interview history
 * @returns {Object} History management methods and state
 */
const useHistoryManager = () => {
  // State
  const [history, setHistory] = useState({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  
  // Chakra UI toast
  const toast = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('interviewHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed || {});
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      // If there's an error, initialize with empty object
      setHistory({});
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (history && Object.keys(history).length > 0) {
        localStorage.setItem('interviewHistory', JSON.stringify(history));
      } else {
        // If history is empty, remove the item from localStorage
        localStorage.removeItem('interviewHistory');
      }
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
      toast({
        title: 'Error saving history',
        description: 'Could not save your history to local storage',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [history, toast]);

  /**
   * Save an interview result to history
   * @param {string} topic - The topic of the question
   * @param {string} question - The question that was asked
   * @param {string} answer - The user's answer
   * @param {Object} feedback - The feedback from the AI
   */
  const saveResult = (topic, question, answer, feedback) => {
    if (!topic || !question || !answer || !feedback) {
      console.error('Missing required parameters for saveResult');
      toast({
        title: 'Cannot save result',
        description: 'Missing required information',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const timestamp = new Date().toISOString();
    const dateKey = new Date().toLocaleDateString();
    
    setHistory(prevHistory => {
      // Create deep copy to ensure state update
      const newHistory = prevHistory ? JSON.parse(JSON.stringify(prevHistory)) : {};
      
      // Initialize topic if it doesn't exist
      if (!newHistory[topic]) {
        newHistory[topic] = {};
      }
      
      // Initialize date if it doesn't exist
      if (!newHistory[topic][dateKey]) {
        newHistory[topic][dateKey] = [];
      }
      
      // Add new entry
      newHistory[topic][dateKey].push({
        id: timestamp,
        question,
        answer,
        score: feedback.overallScore || 0,
        feedback: {
          generalFeedback: feedback.generalFeedback || '',
          categories: feedback.categories || {},
          additionalMetrics: feedback.additionalMetrics || {},
          improvementSuggestions: feedback.improvementSuggestions || [],
          exampleAnswer: feedback.exampleAnswer || ''
        }
      });
      
      return newHistory;
    });
    
    toast({
      title: 'Result saved',
      description: 'Your answer has been saved to history',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  /**
   * Delete an entry from history
   * @param {string} topic - The topic of the entry
   * @param {string} dateKey - The date key of the entry
   * @param {string} entryId - The ID of the entry to delete
   */
  const deleteHistoryEntry = (topic, dateKey, entryId) => {
    if (!topic || !dateKey || !entryId) {
      console.error('Missing required parameters for deleteHistoryEntry');
      return;
    }
    
    setHistory(prevHistory => {
      // If history is empty, return empty object
      if (!prevHistory) return {};
      
      // Create deep copy to ensure state update
      const newHistory = JSON.parse(JSON.stringify(prevHistory));
      
      // Filter out the entry to delete
      if (newHistory[topic] && newHistory[topic][dateKey]) {
        newHistory[topic][dateKey] = newHistory[topic][dateKey].filter(
          entry => entry.id !== entryId
        );
        
        // Clean up empty date arrays
        if (newHistory[topic][dateKey].length === 0) {
          delete newHistory[topic][dateKey];
        }
        
        // Clean up empty topics
        if (Object.keys(newHistory[topic]).length === 0) {
          delete newHistory[topic];
        }
      }
      
      return newHistory;
    });
    
    toast({
      title: 'Entry deleted',
      description: 'History entry has been removed',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  /**
   * Get a color based on score for visual feedback
   * @param {number} score - The score (0-100)
   * @returns {string} A color code or name
   */
  const getScoreColor = (score = 0) => {
    if (score >= 90) return 'green.500';
    if (score >= 80) return 'green.400';
    if (score >= 70) return 'yellow.500';
    if (score >= 60) return 'orange.500';
    return 'red.500';
  };

  /**
   * Toggle the history sidebar visibility
   */
  const toggleHistory = () => {
    setIsHistoryOpen(prev => !prev);
  };

  /**
   * Clear all history
   */
  const clearAllHistory = () => {
    setHistory({});
    localStorage.removeItem('interviewHistory');
    
    toast({
      title: 'History cleared',
      description: 'All history entries have been removed',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return {
    // State
    history,
    isHistoryOpen,
    
    // Methods
    saveResult,
    deleteHistoryEntry,
    getScoreColor,
    toggleHistory,
    clearAllHistory,
  };
};

export default useHistoryManager;