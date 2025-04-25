import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { analyzeResponse } from '../api/openai';

/**
 * Custom hook for managing interview response analysis
 * @returns {Object} Analysis methods and state
 */
const useResponseAnalysis = () => {
  // State
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Chakra UI toast
  const toast = useToast();

  /**
   * Analyze a user response to an interview question
   * @param {string} question - The interview question
   * @param {string} answer - The user's answer
   */
  const analyzeUserResponse = async (question, answer) => {
    if (!answer || answer === "Transcribing your answer...") {
      toast({
        title: 'Cannot analyze',
        description: 'No valid answer to analyze',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const analysisResult = await analyzeResponse(question, answer);
      setFeedback(analysisResult);
      
      toast({
        title: 'Analysis complete',
        description: 'Your answer has been evaluated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error analyzing response:', error);
      
      setFeedback({
        overallScore: 0,
        generalFeedback: "Sorry, there was an error analyzing your response. Please try again.",
        categories: {},
        additionalMetrics: {},
        improvementSuggestions: ["Try recording again"]
      });
      
      toast({
        title: 'Analysis error',
        description: 'Could not analyze your response',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Reset analysis feedback
   */
  const resetFeedback = () => {
    setFeedback(null);
  };

  return {
    // State
    feedback,
    isAnalyzing,
    
    // Methods
    analyzeUserResponse,
    resetFeedback,
  };
};

export default useResponseAnalysis;