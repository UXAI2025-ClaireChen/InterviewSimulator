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
} from '@chakra-ui/react';
import OverallScore from '../FeedbackPanel/OverallScore';
import StarEvaluation from '../FeedbackPanel/StarEvaluation';

/**
 * Modal component to display history item details
 */
const HistoryDetailModal = ({ isOpen, onClose, historyItem, getScoreColor }) => {
  // If no history item is selected, don't render anything
  if (!historyItem) return null;
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  
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
          <Box mb={6}>
            <Heading size="sm" mb={2}>Your Answer</Heading>
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="gray.200"
              bg="gray.50"
            >
              <Text whiteSpace="pre-wrap">{historyItem.answer}</Text>
            </Box>
          </Box>
          
          <Divider mb={6} />
          
          <Box mb={6}>
            <OverallScore 
              score={historyItem.score} 
              feedback={historyItem.feedback.generalFeedback} 
            />
          </Box>
          
          <Box mb={6}>
            <StarEvaluation categories={historyItem.feedback.categories || {}} />
          </Box>
          
          <Divider mb={6} />
          
          <Box mb={6}>
            <Heading size="sm" mb={2}>Example Answer</Heading>
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor="gray.200"
              bg="gray.50"
            >
              <Text whiteSpace="pre-wrap">{historyItem.feedback.exampleAnswer}</Text>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={() => {
            // Logic to practice with this question again
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