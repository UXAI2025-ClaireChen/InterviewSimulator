// src/components/History/HistoryList.jsx

import React from 'react';
import {
  Box,
  Text,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import HistoryItem from './HistoryItem';

const HistoryList = ({
  history,
  onDeleteEntry,
  onClearHistory,
  onSelectHistoryItem,
  getScoreColor,
  selectedHistoryItemId,
}) => {
  // Handle selecting an item
  const handleItemSelect = (topic, date, entry) => {
    if (onSelectHistoryItem) {
      onSelectHistoryItem(entry);
    }
  };

  return (
    <>
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
                          onSelect={() => handleItemSelect(topic, date, entry)}
                          onDelete={() => onDeleteEntry && onDeleteEntry(topic, date, entry.id)}
                          getScoreColor={getScoreColor}
                          isSelected={selectedHistoryItemId === entry.id}
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
    </>
  );
};

export default HistoryList;
