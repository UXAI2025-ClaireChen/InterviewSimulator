import React from 'react';
import {
  Box,
  Card,
  VStack,
  Heading,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import OverallScore from './OverallScore';
import StarEvaluation from './StarEvaluation';
import MetricsGrid from './MetricsGrid';
import SuggestionsList from './SuggestionsList';
import ExampleAnswer from './ExampleAnswer';

/**
 * Feedback panel component
 */
const FeedbackPanel = ({ feedback, onReset }) => {
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const feedbackHeaderBg = useColorModeValue('brand.700', 'brand.700');

  // Debug log to verify what data we're receiving
  console.log("Feedback data received in FeedbackPanel:", feedback);

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
                score={feedback.overallScore} 
                feedback={feedback.generalFeedback} 
            />
            
            {/* STAR evaluation */}
            <StarEvaluation categories={feedback.categories || {}} />
            
            {/* Additional metrics */}
            <MetricsGrid metrics={feedback.additionalMetrics || {}} />
            
            {/* Improvement suggestions */}
            <SuggestionsList suggestions={feedback.improvementSuggestions || []} />
            
            {/* Example answer - new component */}
            <ExampleAnswer exampleText={feedback.exampleAnswer || "No example available for this question."} />
            
            {/* Try again button */}
            <Box textAlign="center" pt={4}>
                <Button 
                onClick={onReset}
                colorScheme="brand"
                size="md"
                _hover={{ bg: "brand.700" }}
                _active={{ bg: "brand.900" }}
                >
                Try Again
                </Button>
            </Box>
            </VStack>
        </Box>
    </Box>
  );
};

export default FeedbackPanel;