import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card,
  Flex, 
  Text, 
  Switch, 
  FormControl, 
  FormLabel,
  CircularProgress,
  Circle,
  useColorModeValue 
} from '@chakra-ui/react';
import TextInput from './TextInput';
import RecordingControls from './RecordingControls';
import RecordedAnswer from './RecordedAnswer';

/**
 * Answer panel component
 */
const AnswerPanel = ({
  isTextInputMode,
  toggleTextMode,
  textInputValue,
  setTextInputValue,
  isRecording,
  recordedText,
  isTranscribing,
  recordingTime,
  currentPlaybackTime,
  formattedTime,
  formattedCurrentTime,
  isPlayback,
  isAnalyzing,
  startRecording,
  stopRecording,
  togglePlayback,
  resetRecording,
  handleTextInputSubmit,
}) => {
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const buttonBg = useColorModeValue('brand.500', 'gray.600');
  
  // Add state to track if transcription has been completed
  const [hasTranscribed, setHasTranscribed] = useState(false);
  
  // Update hasTranscribed when recordedText changes from "Transcribing your answer..." to something else
  useEffect(() => {
    if (recordedText && recordedText !== "Transcribing your answer...") {
      setHasTranscribed(true);
    }
  }, [recordedText]);
  
  // Reset hasTranscribed when explicitly resetting the recording
  const handleResetRecording = () => {
    setHasTranscribed(false);
    resetRecording();
  };

  return (
    <Card bg={cardBg} shadow="sm" borderRadius="lg" p={6} borderWidth="0.5px" borderColor="gray.200">
      <Flex direction="column" width="100%">
        {/* Text mode toggle */}
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontWeight="medium">My Answer:</Text>
          
          <FormControl display="flex" alignItems="center" width="auto">
            <FormLabel htmlFor="text-mode-toggle" mb="0" mr={2} fontSize="sm">
              Text Mode
            </FormLabel>
            <Switch 
              id="text-mode-toggle" 
              colorScheme="brand"
              isChecked={isTextInputMode}
              onChange={toggleTextMode}
            />
          </FormControl>
        </Flex>
        
        {/* Text input mode */}
        {isTextInputMode ? (
          <TextInput
            value={textInputValue}
            onChange={setTextInputValue}
            onSubmit={handleTextInputSubmit}
            isDisabled={isAnalyzing}
          />
        ) : (
          <Box>
            {/* Show correct recording interface based on state */}
            {!hasTranscribed && !isTranscribing && !recordedText ? (
              <RecordingControls
                isRecording={isRecording}
                recordingTime={recordingTime}
                formattedTime={formattedTime}
                startRecording={startRecording}
                stopRecording={stopRecording}
              />
            ) : isTranscribing || recordedText === "Transcribing your answer..." ? (
              <Flex direction="column" alignItems="center" py={6}>
                {/* Empty time placeholder with the same height */}
                <Box height="36px" mb={4} visibility="hidden">
                  <Text fontSize="xl" fontWeight="bold">00:00</Text>
                </Box>
                
                {/* Loading indicator with the same size as the recording button */}
                <Circle 
                  size="100px" 
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CircularProgress isIndeterminate color="brand.500" size="60px" />
                </Circle>
                
                {/* Additional text below */}
                <Text mt={4} textAlign="center">Converting your speech to text...</Text>
              </Flex>
            ) : (
              <RecordedAnswer
                recordedText={recordedText}
                recordingTime={recordingTime}
                formattedTime={formattedTime}
                currentPlaybackTime={currentPlaybackTime}
                formattedCurrentTime={formattedCurrentTime}
                isPlayback={isPlayback}
                togglePlayback={togglePlayback}
                handleSubmit={handleTextInputSubmit}
                resetRecording={handleResetRecording}
                isAnalyzing={isAnalyzing}
              />
            )}
          </Box>
        )}

        {/* Show analyzing status */}
        {isAnalyzing && (
          <Box textAlign="center" py={4} mt={4}>
            <CircularProgress isIndeterminate color="brand.500" size="50px" />
            <Text mt={3} fontWeight="medium">AI is analyzing your response...</Text>
          </Box>
        )}
      </Flex>
    </Card>
  );
};

export default AnswerPanel;