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
 * History sidebar component
 */
const HistorySidebar = ({
  history = {},
  isOpen,
  onClose,
  onDeleteEntry,
  onClearHistory,
  onSelectHistoryItem,
  getScoreColor,
  selectedHistoryItemId = null,
}) => {
  // Calculate if we should use a drawer on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Colors
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  // Content of the sidebar
  const sidebarContent = (
    <>
      <Flex
        p={4}
        borderBottomWidth="1px"
        borderColor={borderColor}
        bg={headerBg}
        justify="space-between"
        align="center"
      >
        <Heading size="md">My History</Heading>
        {!isMobile && (
          <IconButton
            aria-label="Close sidebar"
            icon={<ChevronLeftIcon />}
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        )}
      </Flex>

      <Box p={4}>
        <HistoryList
          history={history}
          onDeleteEntry={onDeleteEntry}
          onClearHistory={onClearHistory}
          onSelectHistoryItem={onSelectHistoryItem}
          getScoreColor={getScoreColor}
          selectedHistoryItemId={selectedHistoryItemId}
        />
      </Box>
    </>
  );

  // Responsive layout - drawer on mobile, sidebar on desktop
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader p={0} borderBottomWidth="0px" />
          <DrawerBody p={0}>{sidebarContent}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sidebar
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
      zIndex="1"
    >
      {sidebarContent}
    </Box>
  );
};

export default HistorySidebar;
