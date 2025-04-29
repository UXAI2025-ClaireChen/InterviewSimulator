import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Badge,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

/**
 * History item component for displaying a single history entry
 */
const HistoryItem = ({ 
  entry = {}, 
  onSelect, 
  onDelete, 
  getScoreColor = () => 'gray.500',
  isSelected = false 
}) => {
  // Colors - must be called before any conditional returns
  const bg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedBorder = useColorModeValue('blue.500', 'blue.300');
  
  // Ensure entry is valid
  if (!entry || !entry.question) {
    return null;
  }
  
  // Format date nicer if available
  const formattedDate = entry.date ? entry.date : 
    (entry.id ? new Date(entry.id).toLocaleDateString() : '');
  
  // Default score to 0 if not provided
  const score = entry.score || 0;
  
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg={isSelected ? selectedBg : bg}
      borderColor={isSelected ? selectedBorder : 'gray.200'}
      _hover={{
        bg: isSelected ? selectedBg : hoverBg,
        cursor: 'pointer',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s'
      }}
      transition="all 0.2s"
      onClick={(e) => {
        // Prevent clicking the delete button from triggering the item selection
        if (e.target.closest('button')) return;
        if (onSelect) onSelect();
      }}
    >
      <Flex justify="space-between" align="center" p={2}>
        <Flex direction="column" flex="1" minW="0">
          <Flex justify="space-between" align="center" mb={1}>
            <Badge
              colorScheme={score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'}
              variant="solid"
              borderRadius="full"
              fontSize="xs"
              px={2}
            >
              {score}
            </Badge>
            
            <Text fontSize="xs" color="gray.500">
              {formattedDate}
            </Text>
          </Flex>
          
          <Text 
            fontSize="xs" 
            color="gray.600"
            _dark={{ color: 'gray.400' }}
            noOfLines={1}
          >
            {entry.answer ? entry.answer.substring(0, 50) + (entry.answer.length > 50 ? '...' : '') : 'No answer recorded'}
          </Text>
        </Flex>
        
        <Tooltip label="Delete" placement="top">
          <IconButton
            aria-label="Delete entry"
            icon={<DeleteIcon />}
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete();
            }}
            _hover={{ bg: 'red.100', color: 'red.500' }}
          />
        </Tooltip>
      </Flex>
      
      {/* Color indicator based on score */}
      <Box
        h="3px"
        bg={getScoreColor(score)}
        w="100%"
      />
    </Box>
  );
};

export default HistoryItem;