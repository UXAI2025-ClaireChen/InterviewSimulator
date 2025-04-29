import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  useColorModeValue,
  ButtonGroup,
  Tooltip,
  Text,
  Divider,
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
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const answerBg = useColorModeValue('white', 'gray.600');
  
  return (
    <Box 
      bg={cardBg} 
      mt={6}
      width="100%"
    >
      {/* User's answer section */}
      <Box mb={8}>
        <Heading size="lg" mb={4}>My Answer</Heading>
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="md" 
          bg={answerBg}
          borderColor="gray.200"
        >
          <Text whiteSpace="pre-wrap">{userAnswer}</Text>
        </Box>
      </Box>
      
      <Divider mb={8} />
      
      <Box pb={8}>
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
                variant="outline"
                _hover={{ bg: "brand.50" }}
                // _active={{ bg: "brand.900" }}
              >
                Try Again
              </Button>
              
              <Tooltip label={isSaved ? "This result is already saved" : "Save this result to history"}>
                <Button 
                  leftIcon={<SaveIcon />}
                  onClick={() => onSaveResult(currentQuestion, userAnswer, feedback)}
                  colorScheme="brand"
                  // variant="outline"
                  size="md"
                  isDisabled={isSaved}
                  _hover={{ bg: "brand.700" }}
                  _active={{ bg: "brand.900" }}
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