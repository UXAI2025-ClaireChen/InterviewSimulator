import React from 'react';
import { Box, Flex, Button, Text, CircularProgress } from '@chakra-ui/react';

/**
 * Question bubble component
 */
const QuestionBubble = ({ question, isLoading, onChangeQuestion, bg }) => {
  return (
    <Box 
      position="relative" 
      flex="1" 
      width="100%"
      pl={{ base: 0, md: 4 }}
    >
      {/* Square pointer - only visible on medium screens and up */}
      <Box
        position="absolute"
        left="4px"
        top="50px"
        width="24px"
        height="24px"
        bg={bg}
        transform="rotate(45deg)"
        display={{ base: "none", md: "block" }}
        borderWidth="0 0 0 0px"
        borderColor="gray.200"
      />
      
      <Box 
        position="relative"
        bg={bg}
        p={4}
        borderRadius="lg"
        minH={{ base: "120px", md: "180px" }}
        maxW={{ base: "100%", md: "100%" }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {isLoading ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            flex="1"
            mb={10}
          >
            <CircularProgress isIndeterminate color="brand.700" size="40px" mb={2} />
            <Text fontSize="sm">Loading questions...</Text>
          </Flex>
        ) : (
          <Text 
            fontSize="md" 
            fontWeight="regular"
            mb={4}
            mt={4}
            mx={4}
            ml={8}
            mr={8}
          >
            {question}
          </Text>
        )}
        
        <Box alignSelf="flex-end">
          <Button
            size="sm"
            colorScheme="brand"
            bg="brand.500"
            _hover={{ bg: "brand.700" }}
            _active={{ bg: "brand.900" }}
            onClick={onChangeQuestion}
            isDisabled={isLoading}
            borderRadius="md"
            px={4}
          >
            Another Question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionBubble;