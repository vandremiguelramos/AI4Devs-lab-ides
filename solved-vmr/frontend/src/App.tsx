import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CandidateForm from './components/candidates/CandidateForm';
import CandidateList from './components/candidates/CandidateList';
import theme from './theme';

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-candidate" element={<CandidateForm />} />
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
