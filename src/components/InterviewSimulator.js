import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useToast,
} from '@chakra-ui/react';
import QuestionPanel from './QuestionPanel';
import AnswerPanel from './AnswerPanel';
import FeedbackPanel from './FeedbackPanel';
import useAudioRecording from '../hooks/useAudioRecording';
import useQuestionManager from '../hooks/useQuestionManager';
import useAvatarSelector from '../hooks/useAvatarSelector'; // Changed to use the new hook
import useResponseAnalysis from '../hooks/useResponseAnalysis';

/**
 * Main Interview Simulator component
 */
const InterviewSimulator = () => {
  // State variables
  const [isTextInputMode, setIsTextInputMode] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  
  // Custom hooks
  const {
    selectedTopic,
    currentQuestion,
    isLoadingQuestions,
    changeTopic,
    selectRandomQuestion,
  } = useQuestionManager('Teamwork');
  
  const {
    isRecording,
    isPlayback,
    isTranscribing,
    recordedText,
    recordingTime,
    currentPlaybackTime,
    formattedTime,
    formattedCurrentTime,
    startRecording,
    stopRecording,
    togglePlayback,
    resetRecording,
  } = useAudioRecording();
  
  // Using the new hook to select avatars from a folder
  const {
    avatarUrl,
    isLoading: isLoadingAvatar,
    error: avatarError,
    selectRandomAvatar,
  } = useAvatarSelector('avatars'); // 'avatars' is the folder name containing the avatar images
  
  const {
    feedback,
    isAnalyzing,
    analyzeUserResponse,
    resetFeedback,
  } = useResponseAnalysis();
  
  // Toggle between voice and text input modes
  const toggleTextMode = () => {
    setIsTextInputMode(!isTextInputMode);
  };

  // Handle answer submission
  const handleAnswerSubmit = () => {
    const textToAnalyze = isTextInputMode ? textInputValue : recordedText;
    analyzeUserResponse(currentQuestion, textToAnalyze);
  };

  // Reset the entire interview
  const resetInterview = () => {
    resetRecording();
    resetFeedback();
    setTextInputValue('');
  };

  // Change question and reset interview state
  const handleQuestionChange = () => {
    selectRandomQuestion();
    resetInterview();
    selectRandomAvatar(); // Select a new avatar
  };

  return (
    <Container maxW="5xl" py={8}>
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <Box textAlign="center" py={6}>
          <Heading as="h1" size="3xl" fontWeight="semibold" mb={2}>
            Behavior Question Training Platform
          </Heading>
        </Box>
        
        {/* Question Panel */}
        <QuestionPanel
          selectedTopic={selectedTopic}
          currentQuestion={currentQuestion}
          isLoadingQuestions={isLoadingQuestions}
          onTopicChange={changeTopic}
          onQuestionChange={handleQuestionChange}
          avatarUrl={avatarUrl}
          isGeneratingAvatar={isLoadingAvatar}
          avatarGenerationError={avatarError}
          onGenerateAvatar={selectRandomAvatar}
        />
        
        {/* Answer Panel */}
        <AnswerPanel
          isTextInputMode={isTextInputMode}
          toggleTextMode={toggleTextMode}
          textInputValue={textInputValue}
          setTextInputValue={setTextInputValue}
          isRecording={isRecording}
          recordedText={recordedText}
          isTranscribing={isTranscribing}
          recordingTime={recordingTime}
          currentPlaybackTime={currentPlaybackTime}
          formattedTime={formattedTime}
          formattedCurrentTime={formattedCurrentTime}
          isPlayback={isPlayback}
          isAnalyzing={isAnalyzing}
          startRecording={startRecording}
          stopRecording={stopRecording}
          togglePlayback={togglePlayback}
          resetRecording={resetRecording}
          handleTextInputSubmit={handleAnswerSubmit}
        />
        
        {/* Feedback Panel */}
        {feedback && (
          <FeedbackPanel
            feedback={feedback}
            onReset={resetInterview}
          />
        )}
      </VStack>
    </Container>
  );
};

export default InterviewSimulator;