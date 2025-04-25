import React from 'react';
import {
  Flex,
  Box,
  Button,
  Text,
  CircularProgress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { topics } from '../../data/defaultQuestions';
import AvatarDisplay from './AvatarDisplay';
import QuestionBubble from './QuestionBubble';

/**
 * Question panel component with avatar and question bubble
 */
const QuestionPanel = ({
  selectedTopic,
  currentQuestion,
  isLoadingQuestions,
  onTopicChange,
  onQuestionChange,
  avatarUrl,
  isGeneratingAvatar,
  avatarGenerationError,
  onGenerateAvatar
}) => {
  // Colors
  const questionBubbleBg = useColorModeValue('brand.100', 'gray.600');

  // Handle topic selection
  const handleTopicSelect = (topic) => {
    onTopicChange(topic);
  };

  return (
    <>
      {/* Topic selector with Menu */}
      <Flex mb={4} alignItems="center">
        <Text fontWeight="medium" mr={3}>Topics</Text>
        <Menu matchWidth={true}>
          <MenuButton 
            as={Button} 
            rightIcon={<ChevronDownIcon />}
            isDisabled={isLoadingQuestions}
            width="250px"
            textAlign="left"
            fontWeight="normal"
            borderRadius="md"
            bg="white"
            borderWidth="1px"
            borderColor="gray.300"
            _hover={{ borderColor: "brand.500" }}
            _active={{ bg: "white" }}
            _expanded={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
          >
            {selectedTopic}
          </MenuButton>
          <MenuList maxH="300px" overflowY="auto">
            {topics.map(topic => (
              <MenuItem 
                key={topic} 
                onClick={() => handleTopicSelect(topic)}
                fontWeight={selectedTopic === topic ? "bold" : "normal"}
                color={selectedTopic === topic ? "brand.500" : "inherit"}
                fontSize="sm"
                _hover={{ bg: "brand.50" }}
              >
                {topic}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      {/* Question and avatar section */}
      <Flex 
        alignItems="flex-start" 
        mb={4}
        flexDirection={{ base: "column", md: "row" }}
      >
        {/* Avatar */}
        <AvatarDisplay 
          avatarUrl={avatarUrl}
          isGenerating={isGeneratingAvatar}
          error={avatarGenerationError}
          onGenerateAvatar={onGenerateAvatar}
        />
        
        {/* Question Bubble */}
        <QuestionBubble
          question={currentQuestion}
          isLoading={isLoadingQuestions}
          onChangeQuestion={onQuestionChange}
          bg={questionBubbleBg}
        />
      </Flex>
    </>
  );
};

export default QuestionPanel;