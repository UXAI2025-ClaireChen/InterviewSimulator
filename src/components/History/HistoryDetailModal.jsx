import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Heading,
  Box,
  Badge,
  Flex,
  Divider,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import OverallScore from '../FeedbackPanel/OverallScore';
import StarEvaluation from '../FeedbackPanel/StarEvaluation';

/**
 * Modal component to display history item details
 */
const HistoryDetailModal = ({ isOpen, onClose, historyItem, onPracticeAgain, getScoreColor }) => {
  // Colors - Must be called before any conditional returns
  const bgColor = useColorModeValue('white', 'gray.800');
  const answerBg = useColorModeValue('gray.50', 'gray.600');
  
  // If no history item is selected, render empty modal
  if (!historyItem) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>History Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>No history item selected.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>
          <Heading size="md">{historyItem.question}</Heading>
          <Flex align="center" mt={2}>
            <Badge 
              colorScheme={historyItem.score >= 80 ? 'green' : historyItem.score >= 60 ? 'yellow' : 'red'}
              fontSize="sm"
              py={1}
              px={2}
              borderRadius="full"
            >
              Score: {historyItem.score}
            </Badge>
            <Text ml={2} fontSize="sm" color="gray.500">
              {new Date(historyItem.id).toLocaleString()}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        
        <Divider />
        
        <ModalBody>
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
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={() => {
            // Logic to practice with this question again
            if (onPracticeAgain) onPracticeAgain(historyItem);
            onClose();
          }}>
            Practice Again
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HistoryDetailModal;