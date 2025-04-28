import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  IconButton,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useBreakpointValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, DeleteIcon } from '@chakra-ui/icons';
import HistoryItem from './HistoryItem';
import ProgressSummary from './ProgressSummary';

/**
 * History sidebar component
 */
const HistorySidebar = ({ 
  history = {}, // Add default empty object
  isOpen, 
  onClose, 
  onDeleteEntry, 
  onClearHistory,
  onSelectHistoryItem,
  getScoreColor
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
      
      <Tabs isFitted variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>History</Tab>
          <Tab>Progress</Tab>
        </TabList>
        
        <TabPanels>
          {/* History Tab */}
          <TabPanel p={4}>
            <Text mb={2} fontWeight="medium">Topics</Text>
            
            {Object.keys(history || {}).length === 0 ? (
              <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
                No history yet. Save your results after answering questions.
              </Text>
            ) : (
              <Accordion defaultIndex={[0]} allowMultiple>
                {Object.entries(history || {}).map(([topic, dates]) => (
                  <AccordionItem key={topic} border="none">
                    <AccordionButton py={2} px={0}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {topic}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} pt={2} px={2}>
                      {Object.entries(dates || {}).map(([date, entries]) => (
                        <Box key={date} mb={4}>
                          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                            {date}
                          </Text>
                          <VStack spacing={2} align="stretch">
                            {(entries || []).map((entry) => (
                              <HistoryItem
                                key={entry.id}
                                entry={entry}
                                onSelect={() => onSelectHistoryItem && onSelectHistoryItem(topic, date, entry)}
                                onDelete={() => onDeleteEntry && onDeleteEntry(topic, date, entry.id)}
                                getScoreColor={getScoreColor}
                              />
                            ))}
                          </VStack>
                        </Box>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            
            {Object.keys(history || {}).length > 0 && (
              <Flex justify="center" mt={6}>
                <Tooltip label="Clear all history" placement="top">
                  <IconButton
                    aria-label="Clear all history"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={onClearHistory}
                  />
                </Tooltip>
              </Flex>
            )}
          </TabPanel>
          
          {/* Progress Tab */}
          <TabPanel p={4}>
            <ProgressSummary history={history || {}} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );

  // Responsive layout - drawer on mobile, sidebar on desktop
  if (isMobile) {
    return (
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader p={0} borderBottomWidth="0px">
          </DrawerHeader>
          <DrawerBody p={0}>
            {sidebarContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sidebar
  return (
    <Box
      position="fixed"
      left={isOpen ? "0" : "-300px"}
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