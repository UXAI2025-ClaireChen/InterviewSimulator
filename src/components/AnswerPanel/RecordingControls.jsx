import React from 'react';
import { Flex, Circle, Box, Text, useColorModeValue } from '@chakra-ui/react';

/**
 * Recording controls component for voice recording
 */
const RecordingControls = ({ 
  isRecording, 
  recordingTime,
  formattedTime,
  startRecording, 
  stopRecording 
}) => {
  // Colors
  const buttonBg = useColorModeValue('brand.500', 'gray.600');
  
  return (
    <Flex direction="column" alignItems="center" py={6}>
      {/* Time display - always exists in DOM but only visible when recording */}
      <Box height="36px" mb={4} visibility={isRecording ? "visible" : "hidden"}>
        <Text fontSize="xl" fontWeight="bold">
          {formattedTime}
        </Text>
      </Box>
      
      {/* Button - always in the same position */}
      <Circle 
        size="100px" 
        bg={buttonBg} 
        cursor="pointer" 
        onClick={isRecording ? stopRecording : startRecording}
        _hover={{ 
          transform: "scale(1.05)",
          boxShadow: "lg",
          bg: "brand.700"
        }}
        _active={{
          bg: "brand.900",  // Even darker color when clicked/pressed
        }}
        transition="all 0.2s"
      >
        {!isRecording ? (
          /* Microphone icon */
          <Box as="span" fontSize="3xl" color="white">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.35 9.65V11.35C4.35 15.57 7.78 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
        ) : (
          /* Stop icon */
          <Box as="span" fontSize="xl" color="white">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="12" height="12" fill="white" />
            </svg>
          </Box>
        )}
      </Circle>
    </Flex>
  );
};

export default RecordingControls;