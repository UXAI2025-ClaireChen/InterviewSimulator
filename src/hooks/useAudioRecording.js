import { useState, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { transcribeAudio } from '../api/openai';
import { formatTime } from '../utils/formatters';

/**
 * Custom hook for handling audio recording functionality
 * @returns {Object} Recording methods and state
 */
const useAudioRecording = () => {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayback, setIsPlayback] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioRef = useRef(new Audio());
  
  // Chakra UI toast
  const toast = useToast();

  // Set up audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleAudioEnd = () => {
      setIsPlayback(false);
      setCurrentPlaybackTime(0);
    };
    
    const handleTimeUpdate = () => {
      setCurrentPlaybackTime(Math.floor(audio.currentTime));
    };

    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      clearInterval(recordingTimerRef.current);
      
      // Clean up media recorder if active
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);
  
  // Play Timer
  useEffect(() => {
    if (isPlayback) {
    } else {
      clearInterval(recordingTimerRef.current);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isPlayback]);

  /**
   * Start audio recording
   */
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
        handleTranscription(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start the recording timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
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

  /**
   * Stop audio recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      
      // Stop the recording timer
      clearInterval(recordingTimerRef.current);
    }
  };

  /**
   * Toggle audio playback
   */
  const togglePlayback = () => {
    if (audioRef.current) {
        if (isPlayback) {
          audioRef.current.pause();
          // Reset playback position to beginning when stopping
          audioRef.current.currentTime = 0;
          setCurrentPlaybackTime(0);
        } else {
          audioRef.current.play();
        }
        setIsPlayback(!isPlayback);
      }
  };

  /**
   * Handle audio transcription
   * @param {Blob} audioBlob - Recorded audio blob
   */
  const handleTranscription = async (audioBlob) => {
    try {
      setIsTranscribing(true);
      setRecordedText("Transcribing your answer...");
      
      const transcribedText = await transcribeAudio(audioBlob);
      setRecordedText(transcribedText);
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
    } finally {
      setIsTranscribing(false);
    }
  };

  /**
   * Reset recording state
   */
  const resetRecording = () => {
    setRecordedText('');
    setRecordingTime(0);
    setCurrentPlaybackTime(0);
    setIsPlayback(false);
    
    // Clear audio playback
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  return {
    // State
    isRecording,
    isPlayback,
    isTranscribing,
    recordedText,
    recordingTime,
    currentPlaybackTime,
    formattedTime: formatTime(recordingTime),
    formattedCurrentTime: formatTime(currentPlaybackTime),
    
    // Methods
    startRecording,
    stopRecording,
    togglePlayback,
    resetRecording,
  };
};

export default useAudioRecording;