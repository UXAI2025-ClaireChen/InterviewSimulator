import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useToast,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import QuestionPanel from './QuestionPanel';
import AnswerPanel from './AnswerPanel';
import FeedbackPanel from './FeedbackPanel';
import HistorySidebar from './History/HistorySidebar';
import HistoryToggleButton from './History/HistoryToggleButton';
import useAudioRecording from '../hooks/useAudioRecording';
import useQuestionManager from '../hooks/useQuestionManager';
import useAvatarSelector from '../hooks/useAvatarSelector';
import useResponseAnalysis from '../hooks/useResponseAnalysis';
import useHistoryManager from '../hooks/useHistoryManager';

/**
 * Main Interview Simulator component with history feature
 */
const InterviewSimulator = () => {
  // State variables
  const [isTextInputMode, setIsTextInputMode] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [currentHistoryItem, setCurrentHistoryItem] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
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
  
  const {
    avatarUrl,
    isLoading: isLoadingAvatar,
    error: avatarError,
    selectRandomAvatar,
  } = useAvatarSelector('avatars');
  
  const {
    feedback,
    isAnalyzing,
    analyzeUserResponse,
    resetFeedback,
  } = useResponseAnalysis();
  
  const {
    history,
    isHistoryOpen,
    saveResult,
    deleteHistoryEntry,
    getScoreColor,
    toggleHistory,
    clearAllHistory,
  } = useHistoryManager();
  
  // Chakra UI toast
  const toast = useToast();
  
  // Background color
  const bg = useColorModeValue('gray.50', 'gray.900');
  
  // Toggle between voice and text input modes
  const toggleTextMode = () => {
    setIsTextInputMode(!isTextInputMode);
  };

  // Handle answer submission
  const handleAnswerSubmit = () => {
    const textToAnalyze = isTextInputMode ? textInputValue : recordedText;
    analyzeUserResponse(currentQuestion, textToAnalyze);
    setIsSaved(false);
    setCurrentHistoryItem(null);
  };

  // Reset the entire interview
  const resetInterview = () => {
    resetRecording();
    resetFeedback();
    setTextInputValue('');
    setIsSaved(false);
    setCurrentHistoryItem(null);
  };

  // Change question and reset interview state
  const handleQuestionChange = () => {
    selectRandomQuestion();
    resetInterview();
    selectRandomAvatar();
  };
  
  // Handle saving result to history
  const handleSaveResult = () => {
    const userAnswer = isTextInputMode ? textInputValue : recordedText;
    
    saveResult(
      selectedTopic,
      currentQuestion,
      userAnswer,
      feedback
    );
    
    setIsSaved(true);
  };
  
  // Handle selecting a history item
  const handleSelectHistoryItem = (topic, date, entry) => {
    // Change to the topic if different
    if (topic !== selectedTopic) {
      changeTopic(topic);
    }
    
    // Load the feedback from the history item
    resetFeedback(); // First clear existing feedback
    
    // Set the user's answer - for text mode we can update directly
    if (isTextInputMode) {
      setTextInputValue(entry.answer);
    } else {
      // For voice mode, we can't directly set recordedText, so we'll reset and then
      // rely on the useEffect to update the UI once feedback is loaded
      resetRecording();
    }
    
    // Set the feedback with a slight delay to ensure reset has completed
    setTimeout(() => {
      analyzeUserResponse(entry.question, entry.answer);
      
      // Mark as saved
      setIsSaved(true);
      
      // Keep track of current history item
      setCurrentHistoryItem({
        topic,
        date,
        id: entry.id
      });
    }, 100);
    
    // Close the history sidebar on mobile
    if (window.innerWidth < 768) {
      toggleHistory();
    }
  };

  // Calculate content margin based on history sidebar state
  const contentMargin = { 
    base: 0, 
    md: isHistoryOpen ? "300px" : 0 
  };

  return (
    <Box bg={bg} minH="100vh">
      {/* History sidebar */}
      <HistorySidebar
        history={history}
        isOpen={isHistoryOpen}
        onClose={toggleHistory}
        onDeleteEntry={deleteHistoryEntry}
        onClearHistory={clearAllHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
        getScoreColor={getScoreColor}
      />
      
      {/* History toggle button */}
      <HistoryToggleButton 
        isOpen={isHistoryOpen}
        onClick={toggleHistory}
        display={{ base: 'block', md: 'block' }}
      />
      
      {/* Main content */}
      <Box ml={contentMargin} transition="margin-left 0.3s">
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
                currentQuestion={currentQuestion}
                userAnswer={isTextInputMode ? textInputValue : recordedText}
                onReset={resetInterview}
                onSaveResult={handleSaveResult}
                isSaved={isSaved}
              />
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default InterviewSimulator;