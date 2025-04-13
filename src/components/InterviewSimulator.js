import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Card,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  Select,
  IconButton,
  Circle,
  useColorModeValue,
  Progress,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Divider
} from '@chakra-ui/react';
import { RepeatIcon, CheckCircleIcon } from '@chakra-ui/icons';

const InterviewSimulator = () => {
  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [apiQuestions, setApiQuestions] = useState({});
  const [usedQuestionIndices, setUsedQuestionIndices] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isTextInputMode, setIsTextInputMode] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Teamwork');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayback, setIsPlayback] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioRef = useRef(new Audio());
  const toast = useToast();

  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const questionBubbleBg = useColorModeValue('gray.100', 'gray.600');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const buttonBg = useColorModeValue('gray.500', 'gray.600');
  const feedbackHeaderBg = useColorModeValue('purple.50', 'purple.900');
  const overallBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Avatar images (in a real app, you would import these)
  const avatars = Array.from({ length: 24 }, (_, i) => 
    `/Avatars/Asset ${i + 8}.png`
  );
  
  // Topics
  const topics = [
    'Teamwork',
    'Communication',
    'Leadership',
    'Problem-solving',
    'Time Management',
    'Conflict Resolution',
    'Adaptability',
    'Customer Service',
    'Initiative'
  ];
  
  // Default questions by topic (fallback if API fails)
  const defaultQuestions = {
    'Teamwork': [
      'Tell me about a time when you had to deal with conflict within your team.',
      'Describe a situation where you had to collaborate with a difficult team member.',
      'Share an example of how you\'ve contributed to a team success.',
      'Tell me about a time when you had to step up to help your team meet a deadline.',
      'Describe how you\'ve successfully worked with diverse team members with different working styles.'
    ],
    'Communication': [
      'Tell me about a time when you had to explain a complex concept to someone.',
      'Describe a situation where your communication skills helped resolve a problem.',
      'Share an example of how you\'ve effectively communicated in a challenging situation.',
      'Tell me about a time when you had to deliver difficult news to a colleague or client.',
      'Describe how you\'ve tailored your communication style for different audiences.'
    ],
    'Leadership': [
      'Tell me about a time when you demonstrated leadership skills without having a formal title.',
      'Describe a situation where you had to motivate a team through a difficult period.',
      'Share an example of how you\'ve developed or mentored someone.',
      'Tell me about a time when you had to make an unpopular decision as a leader.',
      'Describe how you\'ve delegated responsibilities effectively.'
    ],
    'Problem-solving': [
      'Tell me about a time when you had to solve a complex problem.',
      'Describe a situation where you had to think creatively to overcome an obstacle.',
      'Share an example of how you\'ve used data or analytics to solve a problem.',
      'Tell me about a time when you anticipated a problem before it occurred.',
      'Describe how you\'ve implemented a solution that improved a process or outcome.'
    ],
    'Time Management': [
      'Tell me about a time when you had to manage multiple priorities.',
      'Describe a situation where you had to meet a tight deadline.',
      'Share an example of how you organize your work to maximize productivity.',
      'Tell me about a time when you had to delegate tasks to meet deadlines.',
      'Describe how you\'ve improved a process to save time.'
    ],
    'Conflict Resolution': [
      'Tell me about a time when you had to address a conflict between team members.',
      'Describe a situation where you successfully resolved a disagreement with a colleague.',
      'Share an example of how you\'ve turned a negative interaction into a positive outcome.',
      'Tell me about a time when you had to find a compromise between different stakeholders.',
      'Describe how you\'ve maintained professional relationships after a conflict.'
    ],
    'Adaptability': [
      'Tell me about a time when you had to quickly adapt to a significant change.',
      'Describe a situation where you had to learn a new skill or technology quickly.',
      'Share an example of how you\'ve successfully worked in an ambiguous environment.',
      'Tell me about a time when your initial approach didn\'t work and you had to change course.',
      'Describe how you\'ve remained effective during organizational changes.'
    ],
    'Customer Service': [
      'Tell me about a time when you had to deal with a difficult customer.',
      'Describe a situation where you went above and beyond for a customer.',
      'Share an example of how you\'ve turned an unhappy customer into a satisfied one.',
      'Tell me about a time when you had to say no to a customer request.',
      'Describe how you\'ve improved a customer-facing process.'
    ],
    'Initiative': [
      'Tell me about a time when you identified an opportunity that others missed.',
      'Describe a situation where you took on responsibilities outside your job description.',
      'Share an example of how you\'ve implemented a new idea or process.',
      'Tell me about a time when you proactively solved a problem before being asked.',
      'Describe how you\'ve pursued professional development on your own initiative.'
    ]
  };

  // Function to format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Function to randomize the avatar
  const randomizeAvatar = () => {
    const newIndex = Math.floor(Math.random() * avatars.length);
    setAvatarIndex(newIndex);
  };

  // Function to fetch interview questions from OpenAI API for a specific topic
  // Update fetchInterviewQuestions function to select a question after successful fetch
  const fetchInterviewQuestions = async (topic) => {
    setIsLoadingQuestions(true);
    try {
      // Make a real API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert interviewer. Generate behavioral interview questions for the STAR method (Situation, Task, Action, Result) related to the topic: ${topic}.`
            },
            {
              role: "user", 
              content: `Generate 5 behavioral interview questions for the topic "${topic}" that are ideal for the STAR method. \
                        Each question should be a single concise sentence, without additional sub-questions or guidance. \
                        Return only the questions as a simple JSON array of strings.`
            }
          ],
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      // Parse the JSON content from the API response with improved error handling
      let parsedQuestions = [];
      try {
        // Get the content from API response
        const content = data.choices[0].message.content;
        
        // Try to parse as JSON
        const jsonContent = JSON.parse(content);
        
        // Look for questions in different possible formats
        if (Array.isArray(jsonContent)) {
          // If the response is directly an array
          parsedQuestions = jsonContent;
        } else if (jsonContent.questions && Array.isArray(jsonContent.questions)) {
          // If the response has a questions property that is an array
          parsedQuestions = jsonContent.questions;
        } else {
          // Try to extract any array property from the response
          const arrayProps = Object.keys(jsonContent).filter(key => 
            Array.isArray(jsonContent[key]) && jsonContent[key].length > 0);
          
          if (arrayProps.length > 0) {
            parsedQuestions = jsonContent[arrayProps[0]];
          } else {
            // Last resort: look for string properties and create an array
            const stringProps = Object.keys(jsonContent).filter(key => 
              typeof jsonContent[key] === 'string' && jsonContent[key].trim().length > 10);
            
            if (stringProps.length > 0) {
              parsedQuestions = stringProps.map(key => jsonContent[key]);
            }
          }
        }
        
        // Validate that we got something useful
        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
          console.warn('Could not find questions array in API response, using direct content');
          // Use the content directly as a single question if needed
          if (content && typeof content === 'string' && content.length > 10) {
            // Split by newlines or sentences if it seems like multiple questions
            if (content.includes('\n') || (content.split('.').length > 3)) {
              parsedQuestions = content
                .split(/\n+|(?<=\.)(?=\s*[A-Z])/)
                .filter(q => q.trim().length > 15)
                .slice(0, 5);
            } else {
              parsedQuestions = [content];
            }
          }
        }
        
        // Final validation
        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
          throw new Error('Could not extract valid questions from API response');
        }
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        console.log('Raw API response:', data.choices[0].message.content);
        throw new Error('Failed to parse API response');
      }
      
      // After success, update questions and reset used indices
      setApiQuestions(prev => ({
        ...prev,
        [topic]: parsedQuestions
      }));
      
      // Reset used question indices for this topic
      setUsedQuestionIndices(prev => ({
        ...prev,
        [topic]: []
      }));
      
      toast({
        title: 'Questions loaded',
        description: `New ${topic} questions are ready`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // After getting new questions, automatically select one
      setTimeout(() => {
        const questions = parsedQuestions.length > 0 ? parsedQuestions : defaultQuestions[topic] || [];
        if (questions.length > 0) {
          const randomIndex = Math.floor(Math.random() * questions.length);
          setCurrentQuestion(questions[randomIndex]);
          
          // Mark this question as used
          setUsedQuestionIndices(prev => ({
            ...prev,
            [topic]: [randomIndex]
          }));
          
          // Reset interview state
          resetInterview();
          
          // Randomly change avatar
          // randomizeAvatar();
        }
      }, 100); // Short delay to ensure state has updated
      
    } catch (error) {
      console.error(`Error fetching ${topic} interview questions:`, error);
      // Fallback to default questions if API fails
      setApiQuestions(prev => ({
        ...prev,
        [topic]: defaultQuestions[topic] || []
      }));
      
      setUsedQuestionIndices(prev => ({
        ...prev,
        [topic]: []
      }));
      
      toast({
        title: 'Error loading questions',
        description: 'Using default questions instead',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      
      // Select a default question when API fails
      setTimeout(() => {
        if (defaultQuestions[topic] && defaultQuestions[topic].length > 0) {
          const randomIndex = Math.floor(Math.random() * defaultQuestions[topic].length);
          setCurrentQuestion(defaultQuestions[topic][randomIndex]);
          
          // Mark this question as used
          setUsedQuestionIndices(prev => ({
            ...prev,
            [topic]: [randomIndex]
          }));
          
          // Reset interview state
          resetInterview();
          
          // Randomly change avatar
          // randomizeAvatar();
        }
      }, 100);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Get questions for the current topic
  const getTopicQuestions = () => {
    // If we have API questions for this topic, use those
    if (apiQuestions[selectedTopic] && apiQuestions[selectedTopic].length > 0) {
      return apiQuestions[selectedTopic];
    }
    
    // Otherwise use default questions
    return defaultQuestions[selectedTopic] || [];
  };

  // Select a random question from the current topic
  const selectRandomQuestion = () => {
    const questions = getTopicQuestions();
    
    // Check if all questions have been used
    const usedIndices = usedQuestionIndices[selectedTopic] || [];
    if (usedIndices.length >= questions.length) {
      // If all questions have been used, fetch new questions
      fetchInterviewQuestions(selectedTopic);
      return;
    }
    
    // Find an unused question index
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (usedIndices.includes(randomIndex) && usedIndices.length < questions.length);
    
    // Mark this question as used
    setUsedQuestionIndices(prev => ({
      ...prev,
      [selectedTopic]: [...(prev[selectedTopic] || []), randomIndex]
    }));
    
    setCurrentQuestion(questions[randomIndex]);
    resetInterview();
  };

  // Handle topic change
  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setSelectedTopic(newTopic);
    
    // Check if we already have questions for this topic
    if (!apiQuestions[newTopic] || apiQuestions[newTopic].length === 0) {
      // Fetch questions for this topic if we don't have them yet
      fetchInterviewQuestions(newTopic);
    } else {
      // If we already have questions, just select a random one
      setTimeout(() => {
        selectRandomQuestion();
      }, 10);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Create a URL for the audio blob for playback
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        
        // Send the audio to OpenAI Whisper API for transcription
        convertSpeechToText(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start the recording timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: 'Recording started',
        description: 'Speak clearly for better transcription',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Could not access microphone:', error);
      toast({
        title: 'Microphone error',
        description: 'Could not access your microphone',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the recording timer
      clearInterval(recordingTimerRef.current);
      
      toast({
        title: 'Recording completed',
        description: 'Processing your answer',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Toggle playback
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlayback) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayback(!isPlayback);
    }
  };

  // Convert speech to text using OpenAI Whisper API
  const convertSpeechToText = async (audioBlob) => {
    try {
      setRecordedText("Transcribing your answer...");
      
      // Create form data to send the audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'whisper-1');
      
      // Make the API call
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const transcribedText = data.text;
      
      setRecordedText(transcribedText);
      // Don't automatically analyze yet, wait for user to submit
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setRecordedText("Error transcribing audio. Please try again.");
      toast({
        title: 'Transcription error',
        description: 'Unable to transcribe your recording',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle text input submission
  const handleTextInputSubmit = () => {
    const textToAnalyze = isTextInputMode ? textInputValue : recordedText;
    
    if (textToAnalyze && textToAnalyze !== "Transcribing your answer...") {
      analyzeResponse(textToAnalyze);
      
      toast({
        title: 'Answer submitted',
        description: 'Processing your answer',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Analyze response using OpenAI API
  const analyzeResponse = async (text) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system", 
              content: `You are an expert interviewer and coach. Analyze the following interview response using the STAR method.
              Your analysis should include:
              1. Overall score (out of 100)
              2. Score and feedback for each component (each out of 100): Situation, Task, Action, Result
              3. Additional metrics (each out of 100): Relevance, Clarity, Structure
              4. General feedback and improvement suggestions.
              Return your analysis in JSON format with the structure:
              {
                "overallScore": number,
                "categories": {
                  "situation": { "score": number, "feedback": string },
                  "task": { "score": number, "feedback": string },
                  "action": { "score": number, "feedback": string },
                  "result": { "score": number, "feedback": string }
                },
                "additionalMetrics": {
                  "relevance": { "score": number, "feedback": string },
                  "clarity": { "score": number, "feedback": string },
                  "structure": { "score": number, "feedback": string }
                },
                "generalFeedback": string,
                "improvementSuggestions": [string, string, string]
              }`
            },
            {
              role: "user", 
              content: `Interview Question: ${currentQuestion}\n\nCandidate's Response: ${text}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      let analysisResult;
      
      try {
        analysisResult = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error('Error parsing analysis result:', parseError);
        throw new Error('Failed to parse analysis result');
      }
      
      setFeedback(analysisResult);
      toast({
        title: 'Analysis complete',
        description: 'Your answer has been evaluated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error analyzing response:', error);
      setFeedback({
        overallScore: 0,
        generalFeedback: "Sorry, there was an error analyzing your response. Please try again.",
        categories: {},
        additionalMetrics: {},
        improvementSuggestions: ["Try recording again"]
      });
      toast({
        title: 'Analysis error',
        description: 'Could not analyze your response',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset interview
  const resetInterview = () => {
    setRecordedText('');
    setFeedback(null);
    setTextInputValue('');
    setRecordingTime(0);
    setIsPlayback(false);
    
    // Clear audio playback
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    return score > 80 ? "green.500" : score > 60 ? "orange.500" : "red.500";
  };

  // Load questions for the initial topic on component mount
  useEffect(() => {
    fetchInterviewQuestions(selectedTopic);
  }, []);

  // Select a random question when API questions are loaded
  useEffect(() => {
    if (apiQuestions[selectedTopic] && apiQuestions[selectedTopic].length > 0 && !currentQuestion && !isLoadingQuestions) {
      selectRandomQuestion();
    } else if (!currentQuestion && !isLoadingQuestions && defaultQuestions[selectedTopic]) {
      // Fallback to default if API hasn't loaded yet
      const randomIndex = Math.floor(Math.random() * defaultQuestions[selectedTopic].length);
      setCurrentQuestion(defaultQuestions[selectedTopic][randomIndex]);
      
      // Track this question as used
      setUsedQuestionIndices(prev => ({
        ...prev,
        [selectedTopic]: [randomIndex]
      }));
    }
  }, [apiQuestions, selectedTopic, currentQuestion, isLoadingQuestions]);

  // Set up audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleAudioEnd = () => {
      setIsPlayback(false);
    };
    
    audio.addEventListener('ended', handleAudioEnd);
    
    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
      clearInterval(recordingTimerRef.current);
    };
  }, []);

  return (
    <Container maxW="5xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center" py={6}>
          <Heading as="h1" size="xl" fontWeight="semibold" mb={2}>
            Behavior Question Training Platform
          </Heading>
        </Box>
        
        {/* Topic selector */}
        <Flex mb={4} alignItems="center">
          <Text fontWeight="medium" mr={3}>Topics</Text>
          <Select 
            value={selectedTopic}
            onChange={handleTopicChange}
            maxW="250px"
            borderRadius="md"
            isDisabled={isLoadingQuestions}
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </Select>
        </Flex>
        
        {/* Question and avatar section */}
        <Flex alignItems="flex-start" mb={4}>
          <IconButton
            icon={<RepeatIcon />}
            aria-label="Shuffle avatar"
            size="sm"
            mr={2}
            onClick={randomizeAvatar}
            isDisabled={isLoadingQuestions}
          />
          
          <Box 
            as="img"
            src={avatars[avatarIndex] || "/avatar1.png"} 
            alt="Interviewer avatar"
            boxSize="80px"
            mr={4}
          />
          
          <Box 
            position="relative"
            bg={questionBubbleBg}
            p={4}
            borderRadius="lg"
            maxW="80%"
            flex="1"
          >
            {isLoadingQuestions ? (
              <Flex direction="column" align="center" py={2}>
                <CircularProgress isIndeterminate color="blue.500" size="40px" mb={2} />
                <Text fontSize="sm">Loading questions...</Text>
              </Flex>
            ) : (
              <Text fontSize="md" fontWeight="medium">
                {currentQuestion}
              </Text>
            )}
            
            <Button
              position="absolute"
              right={4}
              bottom={4}
              size="sm"
              colorScheme="orange"
              variant="link"
              onClick={selectRandomQuestion}
              isDisabled={isLoadingQuestions}
            >
              Skip this
            </Button>
          </Box>
        </Flex>
        
        {/* Answer section */}
        <Card bg={cardBg} shadow="sm" borderRadius="lg" p={6}>
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
                  colorScheme="teal"
                  isChecked={isTextInputMode}
                  onChange={() => setIsTextInputMode(!isTextInputMode)}
                />
              </FormControl>
            </Flex>
            
            {/* Text input mode */}
{isTextInputMode ? (
  <Box mb={4}>
    <Textarea
      value={textInputValue}
      onChange={(e) => setTextInputValue(e.target.value)}
      placeholder="Type your answer here..."
      size="md"
      rows={8}
      mb={4}
      borderRadius="md"
    />
    <Button
      onClick={handleTextInputSubmit}
      colorScheme="blue"
      width="full"
      borderRadius="md"
      isDisabled={!textInputValue.trim() || isAnalyzing}
    >
      Submit Answer
    </Button>
  </Box>
) : (
  <Box>
    {/* Show correct recording interface based on state */}
    {!recordedText ? (
      !isRecording ? (
        <Flex justifyContent="center" alignItems="center" py={10}>
          <Circle 
            size="100px" 
            bg={buttonBg} 
            cursor="pointer" 
            onClick={startRecording}
          >
            <Box as="span" fontSize="3xl" color="white">🎙️</Box>
          </Circle>
        </Flex>
      ) : (
        <Flex direction="column" alignItems="center" py={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {formatTime(recordingTime)}
          </Text>
          <Circle 
            size="100px" 
            bg="red.500" 
            cursor="pointer" 
            onClick={stopRecording}
          >
            <Box as="span" fontSize="xl" color="white">■</Box>
          </Circle>
        </Flex>
      )
    ) : recordedText === "Transcribing your answer..." ? (
      <Flex direction="column" alignItems="center" py={6}>
        <CircularProgress isIndeterminate color="blue.500" size="60px" mb={3} />
        <Text>Converting your speech to text...</Text>
      </Flex>
    ) : (
      <Box>
        {/* Show playback controls if there's a recording */}
        <Flex direction="column" alignItems="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {formatTime(recordingTime)}
          </Text>
          <Circle 
            size="100px" 
            bg={buttonBg} 
            cursor="pointer" 
            onClick={togglePlayback}
            mb={4}
          >
            <Box as="span" fontSize="2xl" color="white">
              {isPlayback ? '■' : '▶️'}
            </Box>
          </Circle>
        </Flex>
        
        {/* Action buttons */}
        <Flex justifyContent="space-between" mt={4}>
          <Button
            onClick={handleTextInputSubmit}
            colorScheme="blue"
            flex="1"
            mr={2}
            borderRadius="md"
            isDisabled={isAnalyzing}
          >
            Submit Answer
          </Button>
          <Button
            onClick={resetInterview}
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
            <Text fontWeight="medium" mb={2}>Your Answer:</Text>
            <Text whiteSpace="pre-line">{recordedText}</Text>
          </Box>
        )}
      </Box>
    )}
  </Box>
)}

{/* Show analyzing status */}
{isAnalyzing && (
  <Box textAlign="center" py={4} mt={4}>
    <CircularProgress isIndeterminate color="purple.500" size="50px" />
    <Text mt={3} fontWeight="medium">AI is analyzing your response...</Text>
  </Box>
)}

{/* Display AI feedback and suggestions */}
{feedback && (
  <Card bg={cardBg} shadow="md" borderRadius="lg" mt={6}>
    <Box bg={feedbackHeaderBg} p={4} borderTopRadius="lg">
      <Heading size="md">AI Feedback & Suggestions</Heading>
    </Box>
    <Box p={5}>
      <VStack spacing={6} align="stretch">
        {/* Overall score */}
        <Flex align="center" p={4} bg={overallBg} borderRadius="md">
          <CircularProgress 
            value={feedback.overallScore} 
            color={getScoreColor(feedback.overallScore)} 
            size="100px"
            thickness="8px"
            mr={6}
          >
            <CircularProgressLabel fontWeight="bold" fontSize="xl">
              {feedback.overallScore}
            </CircularProgressLabel>
          </CircularProgress>
          <Box flex="1">
            <Heading size="sm" mb={2}>Overall Assessment</Heading>
            <Text>{feedback.generalFeedback}</Text>
          </Box>
        </Flex>
        
        {/* STAR evaluation */}
        <Box>
          <Heading size="sm" mb={4}>STAR Components Evaluation</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {Object.entries(feedback.categories || {}).map(([key, value]) => (
              <Box 
                key={key} 
                p={4} 
                borderWidth="1px" 
                borderRadius="md" 
                borderColor={borderColor}
              >
                <Stat>
                  <Flex justify="space-between" align="center">
                    <StatLabel textTransform="capitalize" fontSize="md">{key}</StatLabel>
                    <StatNumber
                      fontSize="xl"
                      color={getScoreColor(value.score)}
                    >
                      {value.score}
                    </StatNumber>
                  </Flex>
                  <StatHelpText>{value.feedback}</StatHelpText>
                </Stat>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Additional metrics */}
        <Box>
          <Heading size="sm" mb={4}>Additional Metrics</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {Object.entries(feedback.additionalMetrics || {}).map(([key, value]) => (
              <Box 
                key={key} 
                p={3} 
                borderWidth="1px" 
                borderRadius="md" 
                borderColor={borderColor}
              >
                <Stat size="sm">
                  <Flex justify="space-between" align="center">
                    <StatLabel textTransform="capitalize">{key}</StatLabel>
                    <StatNumber
                      fontSize="lg"
                      color={getScoreColor(value.score)}
                    >
                      {value.score}
                    </StatNumber>
                  </Flex>
                  <StatHelpText fontSize="sm">{value.feedback}</StatHelpText>
                </Stat>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Improvement suggestions */}
        <Box>
          <Heading size="sm" mb={3}>Improvement Suggestions</Heading>
          <List spacing={2}>
            {(feedback.improvementSuggestions || []).map((suggestion, index) => (
              <ListItem key={index} display="flex">
                <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                <Text>{suggestion}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Try again button */}
        <Box textAlign="center" pt={4}>
          <Button 
            onClick={resetInterview}
            colorScheme="purple"
            size="lg"
            shadow="md"
          >
            Try Again
          </Button>
        </Box>
      </VStack>
    </Box>
  </Card>
)}
</Flex>
</Card>
</VStack>
</Container>
);
};

export default InterviewSimulator;