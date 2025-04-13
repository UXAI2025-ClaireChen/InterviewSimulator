import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  useColorModeValue,
  Textarea,
  Switch,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

const InterviewSimulator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [apiQuestions, setApiQuestions] = useState([]);
  // Track which questions have been used
  const [usedQuestionIndices, setUsedQuestionIndices] = useState([]);
  // Track if questions are loading
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  // Text input mode states
  const [isTextInputMode, setIsTextInputMode] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const toast = useToast();

  // Colors - defined outside of conditionals
  const cardBg = useColorModeValue('white', 'gray.700');
  const headerBg = useColorModeValue('blue.50', 'blue.900');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const feedbackHeaderBg = useColorModeValue('purple.50', 'purple.900');
  const overallBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Default sample interview questions (fallback if API fails)
  const defaultQuestions = [
    'Describe a challenging situation you faced at work and how you successfully resolved it.',
    'Tell me about a project you led and how you ensured its successful completion.',
    'Share a time when you had to make a decision under pressure and how you handled it.',
    'Tell me about a time when you had to deal with conflict within your team.',
    'Describe a goal you set for yourself and how you achieved it.'
  ];

  // Function to fetch interview questions from OpenAI API
  const fetchInterviewQuestions = async () => {
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
              content: "You are an expert interviewer. Generate behavioral interview questions for the STAR method (Situation, Task, Action, Result)."
            },
            // {
            //   role: "user", 
            //   content: "Generate 5 different behavioral interview questions that are perfect for the STAR method. Return only the questions as a simple JSON array of strings."
            // }
            {
              role: "user", 
              content: "Generate 5 behavioral interview questions that are ideal for the STAR method. \
                        Each question should be a single concise sentence, without additional sub-questions or guidance. \
                        Return only the questions as a simple JSON array of strings."
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
      
      setApiQuestions(parsedQuestions);
      // Reset used question indices when new questions are fetched
      setUsedQuestionIndices([]);
      
      toast({
        title: 'Questions loaded',
        description: 'New interview questions are ready',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching interview questions:', error);
      // Fallback to default questions if API fails
      setApiQuestions(defaultQuestions);
      setUsedQuestionIndices([]);
      
      toast({
        title: 'Error loading questions',
        description: 'Using default questions instead',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Select a random question
  const selectRandomQuestion = () => {
    const questions = apiQuestions.length > 0 ? apiQuestions : defaultQuestions;
    
    // Check if all questions have been used
    if (usedQuestionIndices.length >= questions.length) {
      // Fetch new questions if all current ones have been used
      // Silently fetch new questions without notifying the user
      fetchInterviewQuestions();
      return;
    }
    
    // Find an unused question index
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (usedQuestionIndices.includes(randomIndex));
    
    // Mark this question as used
    setUsedQuestionIndices(prev => [...prev, randomIndex]);
    setCurrentQuestion(questions[randomIndex]);
    resetInterview();
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
        // Send the audio to OpenAI Whisper API for transcription
        convertSpeechToText(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: 'Recording started',
        description: 'Speak clearly for better transcription',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Could not access microphone:', error);
      toast({
        title: 'Microphone error',
        description: 'Could not access your microphone',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: 'Recording completed',
        description: 'Processing your answer',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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
      analyzeResponse(transcribedText);
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
    if (textInputValue.trim()) {
      setRecordedText(textInputValue);
      analyzeResponse(textInputValue);
      
      toast({
        title: 'Answer submitted',
        description: 'Processing your text input',
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
  };

  // Generate a sample answer for the current question
  const generateSampleAnswer = () => {
    const sampleAnswers = {
      challenging: "In my previous role as a project manager, I faced a significant challenge when our main client requested a 30% reduction in timeline while maintaining the same scope. I first analyzed the project plan to identify areas where we could optimize without compromising quality. Then, I organized a team meeting to discuss the situation and brainstorm solutions. I divided the team into specialized sub-groups working in parallel rather than sequentially and implemented daily stand-ups to quickly address any blockers. I also negotiated with the client to prioritize features for a phased delivery approach. As a result, we delivered the core functionality within the shortened timeline and completed the remaining features in a second release two weeks later. The client was extremely satisfied, which led to a 20% larger contract the following quarter.",
      project: "I led a cross-functional team of 12 people to implement a new inventory management system across our organization. My responsibility was to coordinate between IT, warehouse operations, finance, and external vendors. I started by creating a detailed project plan with clear milestones and established a RACI matrix to clarify roles and responsibilities. To manage stakeholder expectations, I set up a communication schedule with regular updates and created a risk register that we reviewed weekly. When we encountered integration issues with legacy systems, I prioritized allocating additional developer resources to address these problems. I also organized hands-on training sessions for end-users, resulting in higher adoption rates. The project was completed on time and 5% under budget, and improved inventory accuracy from 82% to 97%, reducing annual costs by approximately $300,000.",
      pressure: "During the final phase of our product launch, we discovered a critical bug just 48 hours before release. As the lead developer, I quickly assembled a war room with our top engineers. I first assessed the severity of the issue and determined it would affect about 25% of user transactions. Then, I developed a triage plan dividing our team into three groups: one to develop a fix, one to test across different scenarios, and one to prepare documentation and communication in case we needed to delay. After identifying the root cause, I personally wrote the patch while guiding the testing team on validation scenarios. We worked through the night and successfully deployed the fix with just 4 hours to spare. Despite the pressure, we ensured thorough testing and documentation. The launch proceeded without any issues, and the executive team commended our quick response that avoided a potential $1.5M revenue impact.",
      conflict: "In my role as a team leader, I experienced a conflict between two senior colleagues who disagreed on the architectural approach for a key project. One advocated for a microservices architecture while the other insisted on a monolithic approach, creating tension that affected the entire team. I first met with each person individually to understand their perspectives and concerns, making sure they felt heard. Then, I organized a structured meeting where I asked them to present their approaches with specific pros and cons related to our business requirements rather than personal preferences. I guided the discussion toward our shared objectives: system performance, maintenance requirements, and development speed. Through this facilitated discussion, we reached a hybrid solution that incorporated elements from both approaches. I created a document outlining the agreed architecture and both team members felt their input was valued. The result was a successful project delivery, improved team dynamics, and a template for resolving technical disagreements that we now use across the department.",
      goal: "I set a goal for myself to improve our department's customer satisfaction score from 75% to 90% within six months. First, I conducted a detailed analysis of customer feedback to identify the main pain points, finding that response time and resolution quality were the biggest issues. I developed a three-part strategy: streamlining our ticketing workflow, implementing a new training program focused on technical knowledge and communication skills, and creating performance metrics that emphasized quality over quantity. I scheduled regular check-ins with my team to track progress and make adjustments. When we hit a plateau at 82% after three months, I conducted follow-up interviews with customers and discovered additional issues with our knowledge base. I then led an initiative to completely revamp our documentation. By the end of the six-month period, we had exceeded our goal, reaching 92% satisfaction. This improvement resulted in a 15% increase in customer retention and was recognized by senior management as a best practice for other departments."
    };

    // Determine which sample answer to use based on the current question
    let sampleAnswer = "";
    const questionLower = currentQuestion.toLowerCase();
    
    if (questionLower.includes("challenge") || questionLower.includes("difficult")) {
      sampleAnswer = sampleAnswers.challenging;
    } else if (questionLower.includes("project") || questionLower.includes("led")) {
      sampleAnswer = sampleAnswers.project;
    } else if (questionLower.includes("pressure") || questionLower.includes("decision")) {
      sampleAnswer = sampleAnswers.pressure;
    } else if (questionLower.includes("conflict")) {
      sampleAnswer = sampleAnswers.conflict;
    } else if (questionLower.includes("goal")) {
      sampleAnswer = sampleAnswers.goal;
    } else {
      // Default to the challenging scenario if no specific match
      sampleAnswer = sampleAnswers.challenging;
    }
    
    setTextInputValue(sampleAnswer);
  };

  // Fetch questions and load a question on initial render
  useEffect(() => {
    fetchInterviewQuestions();
  }, []);
  
  // Select a random question when API questions are loaded or on initial render
  useEffect(() => {
    if (apiQuestions.length > 0 && !currentQuestion && !isLoadingQuestions) {
      selectRandomQuestion();
    } else if (!currentQuestion && !isLoadingQuestions) {
      // Fallback to default if API hasn't loaded yet
      const randomIndex = Math.floor(Math.random() * defaultQuestions.length);
      setCurrentQuestion(defaultQuestions[randomIndex]);
      // Track this question as used
      setUsedQuestionIndices([randomIndex]);
    }
  }, [apiQuestions, currentQuestion, isLoadingQuestions]);

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    return score > 80 ? "green.500" : score > 60 ? "orange.500" : "red.500";
  };
  
  return (
    <Container maxW="5xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center" py={6} px={4} bg={headerBg} borderRadius="lg">
          <Heading as="h1" size="lg" fontWeight="semibold" mb={2} color={primaryColor}>
            Behavior Question Training Platform
          </Heading>
          {/* <Text>Powered by OpenAI APIs for questions, speech-to-text, and analysis</Text> */}
        </Box>
        
        {/* Interview question card */}
        <Card bg={cardBg} shadow="md" borderRadius="lg">
          <CardHeader pb={0}>
            <Heading size="md">Interview Question:</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="lg" fontWeight="medium" mb={4}>
              {currentQuestion}
            </Text>
          </CardBody>
          <CardFooter pt={0}>
            <Flex justify="space-between" width="100%">
              <Button 
                leftIcon={<InfoIcon />}
                onClick={selectRandomQuestion}
                colorScheme="blue" 
                variant="outline"
                isDisabled={isLoadingQuestions}
              >
                New Question
              </Button>
              
              <HStack>
                <FormControl display="flex" alignItems="center">
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
                
                {!isTextInputMode ? (
                  !isRecording ? (
                    <Button 
                      onClick={startRecording}
                      colorScheme="green"
                      rightIcon={<span style={{ fontSize: '0.8em' }}>🎙️</span>}
                      isDisabled={isLoadingQuestions}
                      px={6} // Increase horizontal padding
                      minW="180px" // Set minimum width
                      height="auto" // Allow button height to adapt to content
                      whiteSpace="normal" // Allow text to wrap
                      py={3} // Ensure sufficient vertical padding
                    >
                      Start Answer (Record)
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      colorScheme="red"
                      rightIcon={<span style={{ fontSize: '0.8em' }}>⏹️</span>}
                      px={6} // Increase horizontal padding
                      minW="180px" // Set minimum width
                      height="auto" // Allow button height to adapt to content
                      whiteSpace="normal" // Allow text to wrap
                      py={3} // Ensure sufficient vertical padding
                    >
                      Finish Answer (Stop)
                    </Button>
                  )
                ) : null}
              </HStack>
            </Flex>
          </CardFooter>
        </Card>
        
        {/* Text input mode */}
        {isTextInputMode && (
          <Card bg={cardBg} shadow="md" borderRadius="lg">
            <CardHeader pb={0}>
              <Flex justify="space-between" align="center">
                <Heading size="md">Your Answer (Text Input):</Heading>
                <Button 
                  size="sm" 
                  colorScheme="teal" 
                  variant="outline"
                  onClick={generateSampleAnswer}
                >
                  Generate Sample Answer
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <Textarea
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                placeholder="Type your answer here..."
                size="md"
                rows={8}
                mb={4}
              />
              <Button
                onClick={handleTextInputSubmit}
                colorScheme="green"
                isDisabled={!textInputValue.trim()}
                width="full"
              >
                Submit Answer
              </Button>
            </CardBody>
          </Card>
        )}
        
        {/* Recording status */}
        {isRecording && (
          <Box textAlign="center" py={3}>
            <Badge colorScheme="red" fontSize="lg" p={2} borderRadius="md" animation="pulse 1.5s infinite">
              Recording in progress... (Speak clearly for better Whisper API transcription)
            </Badge>
          </Box>
        )}
        
        {/* Processing indicators */}
        {recordedText === "Transcribing your answer..." && (
          <Box textAlign="center" py={4}>
            <CircularProgress isIndeterminate color="blue.500" size="50px" />
            <Text mt={3} fontWeight="medium">Converting your speech to text...</Text>
          </Box>
        )}
        
        {/* Display transcribed text */}
        {recordedText && recordedText !== "Transcribing your answer..." && (
          <Card bg={cardBg} shadow="md" borderRadius="lg">
            <CardHeader>
              <Heading size="md">Your Answer:</Heading>
            </CardHeader>
            <CardBody>
              <Text whiteSpace="pre-line">{recordedText}</Text>
            </CardBody>
          </Card>
        )}
        
        {/* Show analyzing status */}
        {isAnalyzing && (
          <Box textAlign="center" py={4}>
            <CircularProgress isIndeterminate color="purple.500" size="50px" />
            <Text mt={3} fontWeight="medium">AI is analyzing your response...</Text>
          </Box>
        )}
        
        {/* Display AI feedback and suggestions */}
        {feedback && (
          <Card bg={cardBg} shadow="md" borderRadius="lg">
            <CardHeader bg={feedbackHeaderBg} borderTopRadius="lg">
              <Heading size="md">AI Feedback & Suggestions</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Overall score */}
                <Flex align="center" p={4} bg={overallBg} borderRadius="md">
                  <CircularProgress 
                    value={feedback.overallScore} 
                    color={feedback.overallScore > 80 ? "green.400" : feedback.overallScore > 60 ? "orange.400" : "red.400"} 
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
                    {Object.entries(feedback.categories).map(([key, value]) => (
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
                    {Object.entries(feedback.additionalMetrics).map(([key, value]) => (
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
                    {feedback.improvementSuggestions.map((suggestion, index) => (
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
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default InterviewSimulator;