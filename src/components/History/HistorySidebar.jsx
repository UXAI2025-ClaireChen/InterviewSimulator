import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorModeValue,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import HistoryList from './HistoryList';

/**
 * Sidebar component for displaying user's history
 */
const HistorySidebar = ({
  history = {},
  isOpen,
  onClose,
  onDeleteEntry,
  onClearHistory,
  onSelectHistoryItem,
  getScoreColor,
  getBestScore,
  selectedHistoryItemId = null,
}) => {
  // Determine if the device is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Colors for light/dark modes
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  // Sidebar main content
  const sidebarContent = (
    <>
      {/* Header */}
      <Flex
        p={4}
        borderBottomWidth="1px"
        borderColor={borderColor}
        bg={headerBg}
        justify="space-between"
        align="center"
      >
        <Heading size="md">My History</Heading>
        {/* {!isMobile && (
          <IconButton
            aria-label="Close sidebar"
            icon={<ChevronLeftIcon />}
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        )} */}
      </Flex>

      {/* History list */}
      <Box p={4}>
        <HistoryList
          history={history}
          onDeleteEntry={onDeleteEntry}
          onClearHistory={onClearHistory}
          onSelectHistoryItem={onSelectHistoryItem}
          getScoreColor={getScoreColor}
          getBestScore={getBestScore}
          selectedHistoryItemId={selectedHistoryItemId}
        />
      </Box>
    </>
  );

  // Mobile version using Drawer
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader p={0} borderBottomWidth="0px" />
          <DrawerBody p={0}>
            {sidebarContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop version using fixed Box
  return (
    <Box
      position="fixed"
      left={isOpen ? '0' : '-300px'}
      top="0"
      height="100vh"
      width="300px"
      bg={bg}
      boxShadow="md"
      borderRightWidth="1px"
      borderColor={borderColor}
      transition="left 0.3s"
      overflowY="auto"
      zIndex="99" // Lower than toggle button
    >
      {sidebarContent}
    </Box>
  );
};

export default HistorySidebar;