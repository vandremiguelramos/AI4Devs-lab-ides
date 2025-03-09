import React from 'react';
import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
import CandidateForm from './components/candidates/CandidateForm';

function App() {
  return (
    <ChakraProvider>
      <Box p={8}>
        <Heading mb={6}>ATS System - Add Candidate</Heading>
        <CandidateForm />
      </Box>
    </ChakraProvider>
  );
}

export default App;
