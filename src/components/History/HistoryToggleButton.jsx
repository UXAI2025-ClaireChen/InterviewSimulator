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
 * Supports two modes: standalone and inside sidebar
 */
const HistoryToggleButton = ({
  isOpen = false,
  onClick = () => {},
  insideSidebar = false, // New prop to indicate if button is inside sidebar
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  // If the button is inside the sidebar, we don't need the fixed positioning
  if (insideSidebar) {
    return (
      <Tooltip label="Close history" placement="bottom">
        <IconButton
          aria-label="Close history"
          icon={<ChevronLeftIcon />}
          onClick={onClick}
          size="sm"
          borderRadius="full"
          variant="ghost"
          bg="transparent"
          _hover={{ bg: hoverBgColor }}
        />
      </Tooltip>
    );
  }

  // Original standalone button with fixed positioning
  return (
    <Box
      position="fixed"
      top="20px"
      left="20px" // Always at the left edge when standalone
      zIndex="100"
      transition="left 0.3s"
    >
      <Tooltip label="Open history" placement="right">
        <IconButton
          aria-label="Open history"
          icon={<HamburgerIcon />}
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