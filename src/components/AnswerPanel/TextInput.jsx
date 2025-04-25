import React from 'react';
import { Box, Textarea, Button } from '@chakra-ui/react';

/**
 * Text input component for manually typing an answer
 */
const TextInput = ({ value, onChange, onSubmit, isDisabled }) => {
  return (
    <Box mb={4}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        size="md"
        rows={8}
        mb={4}
        borderRadius="md"
        focusBorderColor="brand.500"
      />
      <Button
        onClick={onSubmit}
        colorScheme="brand"
        width="full"
        borderRadius="md"
        isDisabled={!value.trim() || isDisabled}
        _hover={{ bg: "brand.700" }}
        _active={{ bg: "brand.900" }}
      >
        Submit Answer
      </Button>
    </Box>
  );
};

export default TextInput;