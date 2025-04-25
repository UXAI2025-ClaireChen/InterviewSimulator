import React from 'react';
import { Flex, Box, Text, Heading, CircularProgress, CircularProgressLabel, useColorModeValue } from '@chakra-ui/react';
import { getScoreColor } from '../../utils/formatters';

/**
 * Overall score component showing the main evaluation score and feedback
 */
const OverallScore = ({ score, feedback }) => {
  // Colors
  const overallBg = useColorModeValue('brand.10', 'brand.700');

  return (
    <Box><Heading size="lg" mb={4}>Overall Assessment</Heading>
    <Flex align="center" p={4} bg={overallBg} borderRadius="md">
      <CircularProgress 
        value={score} 
        color={getScoreColor(score)} 
        size="100px"
        thickness="8px"
        mr={6}
      >
        <CircularProgressLabel fontWeight="bold" fontSize="xl">
          {score}
        </CircularProgressLabel>
      </CircularProgress>
      <Box flex="1">
        {/* <Heading size="sm" mb={2}>Overall Assessment</Heading> */}
        <Text>{feedback}</Text>
      </Box>
    </Flex>
    </Box>
  );
};

export default OverallScore;