import React from 'react';
import { Box, Heading, Text, useColorModeValue, VStack, Badge } from '@chakra-ui/react';

/**
 * Example Answer component that shows an AI-generated model response based on feedback
 * with cleanup for any Markdown formatting
 */
const ExampleAnswer = ({ exampleText }) => {
  // Colors
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const highlightColor = useColorModeValue('brand.50', 'brand.900');
  const badgeColor = useColorModeValue('brand.500', 'brand.200');

  // Clean up Markdown formatting (remove stars)
  const cleanText = exampleText ? exampleText.replace(/\*+([^*]+)\*+/g, '$1') : '';
  
  // Split the example text to highlight STAR components if present
  const lines = cleanText.split('\n').filter(line => line.trim() !== '');
  
  // Helper function to extract STAR components from a line
  const extractStarComponent = (line) => {
    // Check for "Situation:", "Task:", etc. at the beginning of the line
    const starLabels = ['Situation', 'Task', 'Action', 'Result'];
    
    for (const label of starLabels) {
      // Check for exact match or case variations
      const regex = new RegExp(`^\\s*${label}\\s*:`, 'i');
      if (regex.test(line)) {
        const parts = line.split(':');
        return {
          isStarComponent: true,
          label: label, // Use the standardized label
          content: parts.slice(1).join(':').trim()
        };
      }
    }
    
    return { isStarComponent: false, content: line };
  };
  
  // Process lines to identify STAR components
  const processedLines = lines.map(line => extractStarComponent(line));
  const hasStarComponents = processedLines.some(line => line.isStarComponent);

  return (
    <Box>
      <Heading size="lg" mb={3}>Example Answer</Heading>
      <Box 
        p={5} 
        borderWidth="1px" 
        borderRadius="md" 
        borderColor={borderColor}
        bg={bgColor}
      >
        {hasStarComponents ? (
          <VStack align="stretch" spacing={4}>
            {processedLines.map((item, index) => {
              // Skip any header lines like "Here's an example"
              if (index === 0 && !item.isStarComponent && 
                  (item.content.toLowerCase().includes('example') || 
                   item.content.toLowerCase().includes('here'))) {
                return null;
              }
              
              // STAR component
              if (item.isStarComponent) {
                return (
                  <Box key={index} p={3} bg={highlightColor} borderRadius="md">
                    <Badge mb={2} colorScheme="brand" fontSize="sm">{item.label}</Badge>
                    <Text>{item.content}</Text>
                  </Box>
                );
              } 
              // Regular text
              else {
                return <Text key={index}>{item.content}</Text>;
              }
            })}
          </VStack>
        ) : (
          // If not in STAR format, just display as regular text
          <Text whiteSpace="pre-wrap">{cleanText}</Text>
        )}
      </Box>
    </Box>
  );
};

export default ExampleAnswer;