import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useColorModeValue,
  Flex,
  Image,
  Link,
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
 * Main Interview Simulator component
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
    setCustomQuestion,
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
    getBestScore,
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

  // Save result to history
  const handleSaveResult = () => {
    const userAnswer = isTextInputMode ? textInputValue : recordedText;
    saveResult(selectedTopic, currentQuestion, userAnswer, feedback);
    setIsSaved(true);
  };

  // Select a history item to view
  const handleSelectHistoryItem = (historyItem) => {
    setSelectedHistoryItem(historyItem);
    setShowHistoryDetail(true);
    setShowQuestionPanel(false);

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      toggleHistory();
    }
  };

  // Practice again with the same question
  const handlePracticeAgain = (historyItem) => {
    resetInterview();

    const itemTopic = historyItem.topic || selectedTopic;
    if (itemTopic !== selectedTopic) {
      changeTopic(itemTopic);
    }

    setCustomQuestion(historyItem.question);
    setShowHistoryDetail(false);
    setShowQuestionPanel(true);

    if (window.innerWidth < 768 && isHistoryOpen) {
      toggleHistory();
    }
  };

  // Close history detail panel
  const handleCloseHistoryDetail = () => {
    setShowHistoryDetail(false);
    setSelectedHistoryItem(null);
    setShowQuestionPanel(true);
  };

  // Start a new random question
  const handleStartNewQuestion = () => {
    handleQuestionChange();
    setShowHistoryDetail(false);
    setSelectedHistoryItem(null);
    setShowQuestionPanel(true);
  };

  // Content margin depending on sidebar state
  const contentMargin = {
    base: 0,
    md: isHistoryOpen ? '300px' : 0,
  };

  // Function to navigate to homepage
  const navigateToHome = () => {
    // Reset the view to question panel and close any history detail
    setShowQuestionPanel(true);
    setShowHistoryDetail(false);
    setSelectedHistoryItem(null);
    
    // You might want to reset other states as needed
    resetInterview();
  };

  return (
    <Box bg={bg} minH="100vh">
      {/* Sidebar */}
      <HistorySidebar
        history={history}
        isOpen={isHistoryOpen}
        onClose={toggleHistory}
        onDeleteEntry={deleteHistoryEntry}
        onClearHistory={clearAllHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
        getScoreColor={getScoreColor}
        getBestScore={getBestScore}
        selectedHistoryItemId={selectedHistoryItem?.id}
      />

      {/* Standalone toggle button - only shown when sidebar is closed */}
      {!isHistoryOpen && (
        <HistoryToggleButton
          isOpen={false}
          onClick={toggleHistory}
          insideSidebar={false}
        />
      )}

      {/* New question button (only when viewing history details) */}
      {!showQuestionPanel && (
        <NewQuestionButton onClick={handleStartNewQuestion} />
      )}

      {/* Main content */}
      <Box ml={contentMargin} transition="margin-left 0.3s">
        <Container maxW="5xl" py={8}>
          <VStack spacing={4} align="stretch">
            {/* Page header with clickable title and icon */}
            <Box textAlign="center" py={6}>
              <Link onClick={navigateToHome} _hover={{ textDecoration: 'none' }}>
                <Flex justifyContent="center" alignItems="center">
                  <Image 
                    // src="/favicon.png" 
                    src={process.env.PUBLIC_URL + '/favicon.png'}
                    alt="Logo" 
                    boxSize="40px" 
                    mr={2}
                  />
                  <Heading as="h1" size="3xl" fontWeight="semibold">
                    Behavior Question Training Platform
                  </Heading>
                </Flex>
              </Link>
            </Box>

            {/* Conditional content: Question panel or History detail panel */}
            {showQuestionPanel ? (
              <VStack spacing={4} align="stretch">
                {/* Question panel */}
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

                {/* Answer panel */}
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

                {/* Feedback panel */}
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
              <HistoryDetailPanel
                historyItem={selectedHistoryItem}
                onClose={handleCloseHistoryDetail}
                onPracticeAgain={handlePracticeAgain}
                getScoreColor={getScoreColor}
                history={history}
                selectedTopic={selectedTopic}
              />
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default InterviewSimulator;
