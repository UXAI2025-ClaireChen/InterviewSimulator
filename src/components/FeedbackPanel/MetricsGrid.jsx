import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatHelpText, Flex, useColorModeValue } from '@chakra-ui/react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { getScoreColor } from '../../utils/formatters';

/**
 * Metrics grid component for additional feedback metrics with circular progress indicators
 */
const MetricsGrid = ({ metrics }) => {
  // Colors
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <Heading size="lg" mb={4}>Additional Metrics</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {Object.entries(metrics).map(([key, value]) => (
          <Box 
            key={key} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md" 
            borderColor={borderColor}
          >
            <Stat size="sm">
              <Flex justify="space-between" align="center">
                <StatLabel textTransform="capitalize">{key}</StatLabel>
                <CircularProgress 
                  value={value.score} 
                  color={getScoreColor(value.score)} 
                  size="50px"
                  thickness="8px"
                >
                  <CircularProgressLabel fontWeight="bold" fontSize="md">
                    {value.score}
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>
              <StatHelpText fontSize="sm" mt={2}>{value.feedback}</StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MetricsGrid;