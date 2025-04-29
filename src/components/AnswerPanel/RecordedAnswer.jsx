import React from 'react';
import { Box, Flex, Button, Text, Circle, useColorModeValue } from '@chakra-ui/react';

/**
 * Component to display recorded and transcribed answer
 */
const RecordedAnswer = ({
  recordedText,
  recordingTime,
  formattedTime,
  currentPlaybackTime,
  formattedCurrentTime,
  isPlayback,
  togglePlayback,
  handleSubmit,
  resetRecording,
  isAnalyzing
}) => {
  // Colors
  const buttonBg = useColorModeValue('brand.500', 'gray.600');

  return (
    <Box>
      {/* Playback controls with consistent layout */}
      <Flex direction="column" alignItems="center" py={6}>
        <Box height="36px" mb={4}>
          <Text fontSize="xl" fontWeight="bold">
            {formattedCurrentTime} / {formattedTime}
          </Text>
        </Box>
        
        {/* Playback button */}
        <Circle 
          size="100px" 
          bg={buttonBg} 
          cursor="pointer" 
          onClick={togglePlayback}
          _hover={{ 
            transform: "scale(1.05)",
            boxShadow: "md",
            bg: "brand.700"
          }}
          _active={{
            bg: "brand.900",  // Even darker color when clicked/pressed
          }}
          transition="all 0.2s"
        >
          {/* Play/stop icons */}
          <Box as="span" fontSize="2xl" color="white">
            {isPlayback ? (
              // Stop icon
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="12" height="12" fill="white" />
              </svg>
            ) : (
              // Play icon
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.14V19.14C8 19.94 8.85 20.44 9.54 20.02L20.54 13.02C21.15 12.65 21.15 11.75 20.54 11.38L9.54 4.38C8.85 3.96 8 4.46 8 5.14Z" fill="white" />
              </svg>
            )}
          </Box>
        </Circle>
      </Flex>
      
      <Flex justifyContent="space-between" mt={4}>
        <Button
          onClick={handleSubmit}
          colorScheme="brand"
          flex="1"
          mr={2}
          borderRadius="md"
          isDisabled={isAnalyzing}
          _hover={{ bg: "brand.700" }}
          _active={{ bg: "brand.900" }}
        >
          Submit Answer
        </Button>
        <Button
          onClick={resetRecording}
          colorScheme="brand"
          variant="outline"
          flex="1"
          ml={2}
          borderRadius="md"
        >
          Try Again
        </Button>
      </Flex>
      
      {/* Recorded text */}
      {recordedText && (
        <Box mt={6} borderTopWidth="1px" pt={4}>
          <Text whiteSpace="pre-line">{recordedText}</Text>
        </Box>
      )}
    </Box>
  );
};

export default RecordedAnswer;