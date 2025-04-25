import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

/**
 * Custom hook for managing avatar selection from a local folder
 * @param {string} folderPath - Path to the avatars folder (relative to public)
 * @returns {Object} Avatar methods and state
 */
const useAvatarSelector = (folderPath = 'avatars') => {
  // State
  const [avatarUrl, setAvatarUrl] = useState('');
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chakra UI toast
  const toast = useToast();

  // Load available avatars on mount
  useEffect(() => {
    loadAvatars();
  }, [folderPath]);

  /**
   * Load available avatars from the folder
   */
  const loadAvatars = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to load avatars from /${folderPath}/avatars.json`);
      
      // In a real app, this would be an API call to get the list of images
      // For demo purposes, we'll use a fetch call to a JSON file that lists the avatars
      const response = await fetch(`${process.env.PUBLIC_URL}/${folderPath}/avatars.json`);
      
      if (!response.ok) {
        console.error(`Error fetching avatars.json: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to load avatars list: ${response.status}`);
      }
      
      // Try to parse as JSON with additional error logging
      let data;
      try {
        const text = await response.text();
        console.log('Response text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON: ${parseError.message}`);
      }
      
      if (!Array.isArray(data.avatars) || data.avatars.length === 0) {
        throw new Error('No avatars found in the folder');
      }
      
      console.log(`Found ${data.avatars.length} avatars`);
      setAvailableAvatars(data.avatars);
      
      // Select a random avatar to start
      selectRandomAvatar(data.avatars);
    } catch (error) {
      console.error('Error loading avatars:', error);
      setError(error.message);
      
      // Use default avatars as fallback
      const defaultAvatars = [
        'placeholder-avatar.png',
        'default-avatar.jpg'
      ];
      
      // Try to find a valid default avatar
      let defaultFound = false;
      for (const defaultAvatar of defaultAvatars) {
        try {
          const testImg = new Image();
          testImg.src = `${process.env.PUBLIC_URL}/${defaultAvatar}`;
          
          // If image loads, use it
          testImg.onload = () => {
            setAvatarUrl(`${process.env.PUBLIC_URL}/${defaultAvatar}`);
            defaultFound = true;
          };
          
          // Wait a bit to see if the image loads
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (defaultFound) break;
        } catch (e) {
          console.warn(`Default avatar ${defaultAvatar} not found`);
        }
      }
      
      // If no default avatar found, create a colored background with initials
      if (!defaultFound) {
        setAvatarUrl(''); // Will trigger fallback rendering
      }
      
      toast({
        title: 'Error loading avatars',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Select a random avatar from the available ones
   */
  const selectRandomAvatar = (avatarsList = availableAvatars) => {
    if (!avatarsList || avatarsList.length === 0) {
      console.warn('No avatars available for random selection');
      setAvatarUrl(`${process.env.PUBLIC_URL}/placeholder-avatar.png`);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * avatarsList.length);
    const selectedAvatar = avatarsList[randomIndex];
    console.log(`Selected avatar: ${selectedAvatar}`);
    setAvatarUrl(`${process.env.PUBLIC_URL}/${folderPath}/${selectedAvatar}`);

    
    // toast({
    //   title: 'New interviewer selected',
    //   status: 'success',
    //   duration: 2000,
    //   isClosable: true,
    // });
  };

  /**
   * Select a specific avatar by filename
   */
  const selectAvatar = (filename) => {
    if (!availableAvatars.includes(filename)) {
      console.warn(`Avatar not found: ${filename}`);
      toast({
        title: 'Avatar not found',
        description: 'The requested avatar could not be found',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    console.log(`Manually selected avatar: ${filename}`);
    setAvatarUrl(`${process.env.PUBLIC_URL}/${folderPath}/${filename}`);
  };

  return {
    // State
    avatarUrl,
    availableAvatars,
    isLoading,
    error,
    
    // Methods
    selectRandomAvatar,
    selectAvatar,
    refreshAvatars: loadAvatars,
  };
};

export default useAvatarSelector;