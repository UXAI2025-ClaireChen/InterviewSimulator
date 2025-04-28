import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  useColorModeValue,
  ButtonGroup,
  Tooltip,
} from '@chakra-ui/react';
import SaveIcon from '../History/SaveIcon';
import OverallScore from './OverallScore';
import StarEvaluation from './StarEvaluation';
import MetricsGrid from './MetricsGrid';
import SuggestionsList from './SuggestionsList';
import ExampleAnswer from './ExampleAnswer';

/**
 * Feedback panel component with save functionality
 */
const FeedbackPanel = ({ 
  feedback = {}, 
  currentQuestion = '', 
  userAnswer = '', 
  onReset = () => {}, 
  onSaveResult = () => {},
  isSaved = false
}) => {
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box 
      bg={cardBg} 
      mt={6}
      width="100%"
    >
      <Box pb={12}>
        <Heading size="2xl">AI Feedback & Suggestions</Heading>
      </Box>
      <Box>
        <VStack spacing={8} align="stretch">
          {/* Overall score */}
          <OverallScore
            score={feedback.overallScore || 0} 
            feedback={feedback.generalFeedback || ''} 
          />
          
          {/* STAR evaluation */}
          <StarEvaluation categories={feedback.categories || {}} />
          
          {/* Additional metrics */}
          <MetricsGrid metrics={feedback.additionalMetrics || {}} />
          
          {/* Improvement suggestions */}
          <SuggestionsList suggestions={feedback.improvementSuggestions || []} />
          
          {/* Example answer */}
          <ExampleAnswer exampleText={feedback.exampleAnswer || "No example available for this question."} />
          
          {/* Action buttons */}
          <Box textAlign="center" pt={4}>
            <ButtonGroup spacing={4}>
              <Button 
                onClick={onReset}
                colorScheme="brand"
                size="md"
                _hover={{ bg: "brand.700" }}
                _active={{ bg: "brand.900" }}
              >
                Try Again
              </Button>
              
              <Tooltip label={isSaved ? "This result is already saved" : "Save this result to history"}>
                <Button 
                  leftIcon={<SaveIcon />}
                  onClick={() => onSaveResult(currentQuestion, userAnswer, feedback)}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  isDisabled={isSaved}
                  _hover={{ bg: "blue.50" }}
                >
                  Save Result
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default FeedbackPanel;