import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatHelpText, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { getScoreColor } from '../../utils/formatters';

/**
 * STAR evaluation component showing scores for Situation, Task, Action, Result
 * with circular progress indicators
 */
const StarEvaluation = ({ categories }) => {
  // Colors
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <Heading size="lg" mb={4}>STAR Components Evaluation</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {Object.entries(categories).map(([key, value]) => (
          <Box 
            key={key} 
            p={4} 
            borderWidth="1px" 
            borderRadius="md" 
            borderColor={borderColor}
          >
            <Stat>
              <Flex justify="space-between" align="center">
                <StatLabel textTransform="capitalize" fontSize="md">{key}</StatLabel>
                <CircularProgress 
                  value={value.score} 
                  color={getScoreColor(value.score)} 
                  size="60px"
                  thickness="8px"
                >
                  <CircularProgressLabel fontWeight="bold" fontSize="lg">
                    {value.score}
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>
              <StatHelpText mt={2}>{value.feedback}</StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StarEvaluation;