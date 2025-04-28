import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

/**
 * Button to start a new question
 */
const NewQuestionButton = ({ 
  onClick = () => {}, 
  position = "fixed",
  display = "block"
}) => {
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('blue.50', 'blue.700');
  
  return (
    <Box 
      position={position} 
      top="20px" 
      right="20px" 
      zIndex="10"
      display={display}
    >
      <Tooltip label="Start a new question" placement="left">
        <IconButton
          aria-label="Start a new question"
          icon={<AddIcon />}
          onClick={onClick}
          size="md"
          borderRadius="full"
          boxShadow="md"
          bg={bgColor}
          color="blue.500"
          _hover={{ 
            bg: hoverBgColor,
            transform: 'scale(1.05)',
            transition: 'all 0.2s'
          }}
          transition="all 0.2s"
        />
      </Tooltip>
    </Box>
  );
};

export default NewQuestionButton;