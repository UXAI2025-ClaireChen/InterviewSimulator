import React from 'react';
import { Box, Heading, List, ListItem, ListIcon, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

/**
 * Suggestions list component for improvement tips
 */
const SuggestionsList = ({ suggestions }) => {
  return (
    <Box>
      <Heading size="lg" mb={3}>Improvement Suggestions</Heading>
      <List spacing={2}>
        {suggestions.map((suggestion, index) => (
          <ListItem key={index} display="flex">
            <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
            <Text>{suggestion}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SuggestionsList;