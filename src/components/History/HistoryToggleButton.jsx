import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronRightIcon } from '@chakra-ui/icons';

/**
 * Toggle button for the history sidebar
 */
const HistoryToggleButton = ({ 
  isOpen = false, 
  onClick = () => {}, 
  position = "fixed",
  display = "block"
}) => {
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Box 
      position={position} 
      top="20px" 
      left={isOpen ? "310px" : "20px"} 
      zIndex="10"
      transition="left 0.3s"
      display={display}
    >
      <Tooltip label={isOpen ? "Close history" : "Open history"} placement="right">
        <IconButton
          aria-label="Toggle history"
          icon={isOpen ? <ChevronRightIcon /> : <HamburgerIcon />}
          onClick={onClick}
          size="md"
          borderRadius="full"
          boxShadow="sm"
          bg={bgColor}
          _hover={{ bg: hoverBgColor }}
        />
      </Tooltip>
    </Box>
  );
};

export default HistoryToggleButton;