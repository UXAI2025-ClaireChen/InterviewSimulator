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

/**
 * Feedback panel component
 */
const FeedbackPanel = ({ feedback, onReset }) => {
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const feedbackHeaderBg = useColorModeValue('brand.700', 'brand.700');

  return (
    <Box 
        bg={cardBg} 
        mt={6}
        width="100%"
        >
        {/* <Box bg={feedbackHeaderBg} p={4} borderTopRadius="lg"> */}
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
    // <Card bg={cardBg} shadow="md" borderRadius="lg" mt={6}>
    //   <Box bg={feedbackHeaderBg} p={4} borderTopRadius="lg">
    //     <Heading size="xl" color="white">AI Feedback & Suggestions</Heading>
    //   </Box>
    //   <Box p={5}>
    //     <VStack spacing={6} align="stretch">
    //       {/* Overall score */}
    //       <OverallScore 
    //         score={feedback.overallScore} 
    //         feedback={feedback.generalFeedback} 
    //       />
          
    //       {/* STAR evaluation */}
    //       <StarEvaluation categories={feedback.categories || {}} />
          
    //       {/* Additional metrics */}
    //       <MetricsGrid metrics={feedback.additionalMetrics || {}} />
          
    //       {/* Improvement suggestions */}
    //       <SuggestionsList suggestions={feedback.improvementSuggestions || []} />
          
    //       {/* Try again button */}
    //       <Box textAlign="center" pt={4}>
    //         <Button 
    //           onClick={onReset}
    //           colorScheme="brand"
    //           size="lg"
    //           shadow="md"
    //           _hover={{ bg: "brand.700" }}
    //           _active={{ bg: "brand.900" }}
    //         >
    //           Try Again
    //         </Button>
    //       </Box>
    //     </VStack>
    //   </Box>
    // </Card>
  );
};

export default FeedbackPanel;