import React from 'react';
import {
  Box,
  Text,
  Heading,
  Badge,
  Flex,
  Divider,
  Button,
  IconButton,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';
import OverallScore from '../FeedbackPanel/OverallScore';
import StarEvaluation from '../FeedbackPanel/StarEvaluation';

/**
 * Component to display history item details directly on the screen
 */
const HistoryDetailPanel = ({ 
  historyItem, 
  onClose, 
  onPracticeAgain, 
  getScoreColor 
}) => {
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const answerBg = useColorModeValue('gray.50', 'gray.600');
  const headingBg = useColorModeValue('gray.50', 'gray.700');
  
  // If no history item is selected, render empty message
  if (!historyItem) {
    return (
      <Box 
        bg={bgColor} 
        p={6} 
        borderRadius="md" 
        boxShadow="md" 
        textAlign="center"
      >
        <Heading size="md" mb={4}>Select a history item</Heading>
        <Text>Click on any history item to view the details here.</Text>
      </Box>
    );
  }
  
  return (
    <Box 
      bg={bgColor} 
      borderRadius="md" 
      boxShadow="md"
      overflow="hidden"
    >
      {/* Header with navigation */}
      <Flex 
        bg={headingBg} 
        p={4} 
        borderBottomWidth="1px" 
        align="center" 
        justify="space-between"
      >
        <Flex align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Go back"
            variant="ghost"
            mr={2}
            onClick={onClose}
          />
          <Heading size="md" noOfLines={1}>{historyItem.question}</Heading>
        </Flex>
        <Badge 
          colorScheme={historyItem.score >= 80 ? 'green' : historyItem.score >= 60 ? 'yellow' : 'red'}
          fontSize="sm"
          py={1}
          px={2}
          borderRadius="full"
        >
          Score: {historyItem.score}
        </Badge>
      </Flex>
      
      {/* Date and metadata */}
      <Flex px={4} py={2} bg={headingBg} borderBottomWidth="1px" justify="space-between" align="center">
        <Text fontSize="sm" color="gray.500">
          {new Date(historyItem.id).toLocaleString()}
        </Text>
        <Button
          leftIcon={<RepeatIcon />}
          colorScheme="blue"
          size="sm"
          variant="outline"
          onClick={() => onPracticeAgain(historyItem)}
        >
          Practice Again
        </Button>
      </Flex>
      
      {/* Content */}
      <Box p={6} maxH={{base: "calc(100vh - 200px)", md: "calc(100vh - 220px)"}} overflow="auto">
        <VStack spacing={6} align="stretch">
          {/* User's answer */}
          <Box>
            <Heading size="md" mb={2}>My Answer</Heading>
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="gray.200"
              bg={answerBg}
            >
              <Text whiteSpace="pre-wrap">{historyItem.answer}</Text>
            </Box>
          </Box>
          
          <Divider />
          
          {/* Feedback */}
          <Box>
            <Heading size="md" mb={4}>AI Feedback</Heading>
            
            <Box mb={4}>
              <OverallScore 
                score={historyItem.score} 
                feedback={historyItem.feedback?.generalFeedback || ''} 
              />
            </Box>
            
            <Box mb={4}>
              <StarEvaluation categories={historyItem.feedback?.categories || {}} />
            </Box>
            
            {historyItem.feedback?.improvementSuggestions?.length > 0 && (
              <Box mt={4}>
                <Heading size="sm" mb={2}>Improvement Suggestions</Heading>
                <Box p={3} borderWidth="1px" borderRadius="md" bg={answerBg}>
                  <VStack align="start" spacing={2}>
                    {historyItem.feedback.improvementSuggestions.map((suggestion, index) => (
                      <Text key={index}>• {suggestion}</Text>
                    ))}
                  </VStack>
                </Box>
              </Box>
            )}
          </Box>
          
          <Divider />
          
          {/* Example answer */}
          <Box>
            <Heading size="md" mb={2}>Example Answer</Heading>
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="gray.200"
              bg={answerBg}
            >
              <Text whiteSpace="pre-wrap">{historyItem.feedback?.exampleAnswer || ''}</Text>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default HistoryDetailPanel;