import React, { useEffect, useState } from 'react';
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
  Tooltip,
} from '@chakra-ui/react';
import { ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';
import OverallScore from '../FeedbackPanel/OverallScore';
import StarEvaluation from '../FeedbackPanel/StarEvaluation';
import MetricsGrid from '../FeedbackPanel/MetricsGrid';
import SuggestionsList from '../FeedbackPanel/SuggestionsList';
import ExampleAnswer from '../FeedbackPanel/ExampleAnswer';

/**
 * Component to display history item details using the same format as FeedbackPanel
 */
const HistoryDetailPanel = ({ 
  historyItem, 
  onClose, 
  onPracticeAgain, 
  getScoreColor,
  history = {},
  selectedTopic = ''
}) => {
  // State to store attempt information
  const [attemptInfo, setAttemptInfo] = useState({ count: 0, current: 0 });

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const answerBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Find the topic that contains this question and the historyItem
  useEffect(() => {
    if (historyItem && history) {
      // Find which topic contains this question and historyItem
      let foundTopic = '';
      let questionAttempts = [];
      
      // Look through all topics
      Object.entries(history).forEach(([topic, questions]) => {
        // Look through all questions in this topic
        Object.entries(questions).forEach(([question, attempts]) => {
          // If this is our question and it contains our historyItem
          if (question === historyItem.question && 
              attempts.some(attempt => attempt.id === historyItem.id)) {
            foundTopic = topic;
            questionAttempts = attempts;
          }
        });
      });
      
      // If we found matching topic and attempts
      if (foundTopic && questionAttempts.length > 0) {
        // Sort attempts by date (oldest first)
        const sortedAttempts = [...questionAttempts].sort(
          (a, b) => new Date(a.id) - new Date(b.id)
        );
        
        // Find current attempt number
        const currentIdx = sortedAttempts.findIndex(
          item => item.id === historyItem.id
        );
        
        setAttemptInfo({
          count: questionAttempts.length,
          current: currentIdx + 1
        });
      }
    }
  }, [historyItem, history]);
  
  // If no history item is selected, render empty message
  if (!historyItem) {
    return (
      <Box 
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
    <Box width="100%">
      {/* Navigation Header */}
      <Flex align="center" mb={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go back"
          variant="ghost"
          mr={2}
          onClick={onClose}
        />
        <Heading size="md" flex="1" noOfLines={1}>{historyItem.question}</Heading>
        <Flex align="center">
          <Tooltip label="The number of times you've attempted this question">
            <Badge mr={2} colorScheme="blue">
              Attempt {attemptInfo.current} of {attemptInfo.count}
            </Badge>
          </Tooltip>
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
      </Flex>
      
      <Divider mb={4} />
      
      {/* User's answer section */}
      <Box mb={8}>
        <Heading size="lg" mb={4}>Question & Answer</Heading>
        <Box mb={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.100" _dark={{ bg: 'gray.700' }}>
          <Text fontWeight="medium">Question:</Text>
          <Text ml={2} mt={1}>{historyItem.question}</Text>
        </Box>
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="md" 
          bg={answerBg}
          borderColor={borderColor}
        >
          <Text fontWeight="medium" mb={2}>My Answer:</Text>
          <Text whiteSpace="pre-wrap">{historyItem.answer}</Text>
        </Box>
      </Box>
      
      <Divider mb={8} />
      
      <Box pb={8}>
        <Heading size="2xl">AI Feedback & Suggestions</Heading>
        <Text mt={2} fontSize="sm" color="gray.500">
          Recorded on {new Date(historyItem.id).toLocaleString()}
        </Text>
      </Box>
      
      <Box>
        <VStack spacing={8} align="stretch">
          {/* Overall score */}
          <OverallScore
            score={historyItem.score} 
            feedback={historyItem.feedback?.generalFeedback || ''} 
          />
          
          {/* STAR evaluation */}
          <StarEvaluation categories={historyItem.feedback?.categories || {}} />
          
          {/* Additional metrics */}
          <MetricsGrid metrics={historyItem.feedback?.additionalMetrics || {}} />
          
          {/* Improvement suggestions */}
          <SuggestionsList suggestions={historyItem.feedback?.improvementSuggestions || []} />
          
          {/* Example answer */}
          <ExampleAnswer exampleText={historyItem.feedback?.exampleAnswer || "No example available for this question."} />
        </VStack>
      </Box>
    </Box>
  );
};

export default HistoryDetailPanel;