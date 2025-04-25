import React from 'react';
import { Box, Flex, CircularProgress, Text, Center } from '@chakra-ui/react';

/**
 * Avatar display component for interviewer with improved image loading
 */
const AvatarDisplay = ({ avatarUrl, isGenerating, error, onGenerateAvatar }) => {
  // Handle loading state
  if (isGenerating) {
    return (
      <Flex 
        align="center" 
        justify="center" 
        width={{ base: "120px", sm: "150px", md: "180px" }}
        height={{ base: "120px", sm: "150px", md: "180px" }}
        border="0px" 
        borderColor="gray.200" 
        borderRadius="md" 
        mr={{ base: 0, md: 4 }}
        bg="gray.100"
        mb={{ base: 4, md: 0 }}
        alignSelf={{ base: "center", md: "flex-start" }}
      >
        <CircularProgress isIndeterminate color="brand.500" size="40px" />
      </Flex>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Flex 
        align="center" 
        justify="center" 
        width={{ base: "120px", sm: "150px", md: "180px" }}
        height={{ base: "120px", sm: "150px", md: "180px" }}
        border="0px" 
        borderColor="red.200" 
        borderRadius="md" 
        mr={{ base: 0, md: 4 }}
        bg="red.50"
        mb={{ base: 4, md: 0 }}
        alignSelf={{ base: "center", md: "flex-start" }}
      >
        <Text fontSize="sm" color="red.500" textAlign="center" p={2}>
          {error}
        </Text>
      </Flex>
    );
  }

  // Handle case where we don't have an avatar URL
  if (!avatarUrl || avatarUrl.includes('undefined')) {
    // Create a fallback with a colored background and initials
    return (
      <Center
        width={{ base: "120px", sm: "150px", md: "180px" }}
        height={{ base: "120px", sm: "150px", md: "180px" }}
        borderRadius="md" 
        mr={{ base: 0, md: 4 }}
        mb={{ base: 4, md: 0 }}
        alignSelf={{ base: "center", md: "flex-start" }}
        bg="brand.500"
        color="white"
        fontSize="4xl"
        fontWeight="bold"
        // cursor="pointer"
        // onClick={onGenerateAvatar}
        _hover={{ bg: "brand.600", boxShadow: "md" }}
      >
        IR
      </Center>
    );
  }

  // Log the avatar URL for debugging
  console.log('Rendering avatar with URL:', avatarUrl);

  // Normal avatar display with proper error handling
  return (
    <Box 
      position="relative"
      width={{ base: "120px", sm: "150px", md: "180px" }}
      height={{ base: "120px", sm: "150px", md: "180px" }}
      borderRadius="md"
      overflow="hidden" 
      mr={{ base: 0, md: 4 }}
      mb={{ base: 4, md: 0 }}
      alignSelf={{ base: "center", md: "flex-start" }}
      border="1px"
      borderColor="gray.200"
    //   onClick={onGenerateAvatar}
    //   cursor="pointer"
      _hover={{ boxShadow: "md" }}
    >
      <Box
        as="img"
        src={avatarUrl.startsWith('/') ? `.${avatarUrl}` : avatarUrl}
        alt="Interviewer"
        width="100%"
        height="100%"
        objectFit="cover"
        onError={(e) => {
          console.error('Error loading avatar image:', e);
          console.log('Failed URL:', e.target.src);
          e.target.onerror = null; // Prevent infinite error loop
          
          // Try with different path prefixes
          if (e.target.src.includes('/avatars/')) {
            console.log('Trying fallback path');
            e.target.src = `./placeholder-avatar.png`;
          } else {
            // Replace with colored div with initials
            e.target.style.display = 'none';
            e.target.parentNode.style.backgroundColor = 'brand.500';
            e.target.parentNode.style.color = 'white';
            e.target.parentNode.style.display = 'flex';
            e.target.parentNode.style.alignItems = 'center';
            e.target.parentNode.style.justifyContent = 'center';
            e.target.parentNode.innerHTML = '<div style="font-size: 2rem; font-weight: bold;">IR</div>';
          }
        }}
      />
    </Box>
  );
};

export default AvatarDisplay;