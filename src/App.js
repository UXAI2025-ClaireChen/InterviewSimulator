import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import InterviewSimulator from './components/InterviewSimulator';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}> 
      <InterviewSimulator />
    </ChakraProvider>
  );
}

export default App;