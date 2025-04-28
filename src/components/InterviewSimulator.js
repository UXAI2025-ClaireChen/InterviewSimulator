import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

// Components
import QuestionPanel from './QuestionPanel';
import AnswerPanel from './AnswerPanel';
import FeedbackPanel from './FeedbackPanel';
import HistorySidebar from './History/HistorySidebar';
import HistoryToggleButton from './History/HistoryToggleButton';
import HistoryDetailPanel from './History/HistoryDetailPanel';
import NewQuestionButton from './History/NewQuestionButton';

// Hooks
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
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  const [showQuestionPanel, setShowQuestionPanel] = useState(true);
  
  // Custom hooks
  const {
    selectedTopic,
    currentQuestion,
    isLoadingQuestions,
    changeTopic,
    selectRandomQuestion,
    setCustomQuestion
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
    setFeedbackManually,
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
  const handleSelectHistoryItem = (historyItem) => {
    // Set the selected history item
    setSelectedHistoryItem(historyItem);
    setShowHistoryDetail(true);
    setShowQuestionPanel(false); // 隱藏問題面板，顯示歷史詳情
    
    // Close the history sidebar on mobile
    if (window.innerWidth < 768) {
      toggleHistory();
    }
  };
  
  // Handle practicing the same question again
  const handlePracticeAgain = (historyItem) => {
    // Reset the interview state
    resetInterview();
    
    // Set topic if different from current
    const itemTopic = historyItem.topic || selectedTopic;
    if (itemTopic !== selectedTopic) {
      changeTopic(itemTopic);
    }

    setCustomQuestion(historyItem.question);
    
    // Hide the history detail and show question panel
    setShowHistoryDetail(false);
    setShowQuestionPanel(true);
    
    // Close the history sidebar on mobile
    if (window.innerWidth < 768 && isHistoryOpen) {
      toggleHistory();
    }
  };
  
  // Close history detail panel and show the question panel
  const handleCloseHistoryDetail = () => {
    setShowHistoryDetail(false);
    setSelectedHistoryItem(null);
    setShowQuestionPanel(true);
  };
  
  // Start a new question
  const handleStartNewQuestion = () => {
    handleQuestionChange();
    setShowHistoryDetail(false);
    setSelectedHistoryItem(null);
    setShowQuestionPanel(true);
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
        selectedHistoryItemId={selectedHistoryItem?.id}
      />
      
      {/* History toggle button */}
      <HistoryToggleButton 
        isOpen={isHistoryOpen}
        onClick={toggleHistory}
        display={{ base: 'block', md: 'block' }}
      />
      
      {/* "Start a new question" button - only shown when viewing history details */}
      {!showQuestionPanel && (
        <NewQuestionButton onClick={handleStartNewQuestion} />
      )}
      
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
            
            {/* Conditional Content - Either Question Panel or History Detail */}
            {showQuestionPanel ? (
              <VStack spacing={4} align="stretch">
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
            ) : (
              /* History Detail Panel - Shown when history item is selected */
              <HistoryDetailPanel
                historyItem={selectedHistoryItem}
                onClose={handleCloseHistoryDetail}
                onPracticeAgain={handlePracticeAgain}
                getScoreColor={getScoreColor}
              />
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default InterviewSimulator;