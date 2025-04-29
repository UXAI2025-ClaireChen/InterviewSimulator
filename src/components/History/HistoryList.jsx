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
  Badge,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import HistoryItem from './HistoryItem';

const HistoryList = ({
  history,
  onDeleteEntry,
  onClearHistory,
  onSelectHistoryItem,
  getScoreColor,
  getBestScore,
  selectedHistoryItemId,
}) => {
  // Handle selecting an item
  const handleItemSelect = (topic, question, entry) => {
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
          {Object.entries(history || {}).map(([topic, questions]) => (
            <AccordionItem key={topic} border="none">
              <AccordionButton py={2} px={0}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  {topic}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} pt={2} px={2}>
                <Accordion allowMultiple>
                  {Object.entries(questions || {}).map(([question, entries]) => {
                    const bestScore = getBestScore(entries);
                    const attemptsCount = entries.length;
                    
                    return (
                      <AccordionItem key={question} borderWidth="1px" borderRadius="md" mb={3} overflow="hidden">
                        <AccordionButton py={2} px={3} bg="gray.50" _dark={{ bg: 'gray.700' }}>
                          <Flex flex="1" alignItems="center" justifyContent="space-between">
                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                              {question}
                            </Text>
                            <Flex alignItems="center">
                              <Badge 
                                colorScheme={bestScore >= 80 ? 'green' : bestScore >= 60 ? 'yellow' : 'red'}
                                mr={2}
                              >
                                {bestScore}
                              </Badge>
                              <Badge colorScheme="blue">
                                {attemptsCount} {attemptsCount === 1 ? 'attempt' : 'attempts'}
                              </Badge>
                              <AccordionIcon ml={2} />
                            </Flex>
                          </Flex>
                        </AccordionButton>
                        <AccordionPanel pb={3} pt={2} px={2}>
                          {/* <Text fontSize="xs" mb={2} color="gray.600" _dark={{ color: 'gray.400' }}>
                            Most recent attempts first
                          </Text> */}
                          <VStack spacing={2} align="stretch">
                            {(entries || [])
                              .sort((a, b) => new Date(b.id) - new Date(a.id)) // Sort by date, newest first
                              .map((entry) => (
                                <HistoryItem
                                  key={entry.id}
                                  entry={entry}
                                  onSelect={() => handleItemSelect(topic, question, entry)}
                                  onDelete={() => onDeleteEntry && onDeleteEntry(topic, question, entry.id)}
                                  getScoreColor={getScoreColor}
                                  isSelected={selectedHistoryItemId === entry.id}
                                />
                            ))}
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
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