import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronLeftIcon } from '@chakra-ui/icons';

/**
 * Toggle button for the history sidebar
 */
const HistoryToggleButton = ({
  isOpen = false,
  onClick = () => {},
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      position="fixed"
      top="20px"
      left={isOpen ? '310px' : '20px'} // Adjust position based on isOpen
      zIndex="100"
      transition="left 0.3s"
    >
      <Tooltip label={isOpen ? "Close history" : "Open history"} placement="right">
        <IconButton
          aria-label="Toggle history"
          icon={isOpen ? <ChevronLeftIcon /> : <HamburgerIcon />}
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
