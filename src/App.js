import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import InterviewSimulator from './components/InterviewSimulator';

function App() {
  return (
    <ChakraProvider>
      <InterviewSimulator />
    </ChakraProvider>
  );
}

export default App;