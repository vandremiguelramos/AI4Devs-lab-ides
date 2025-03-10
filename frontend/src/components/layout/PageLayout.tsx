import React from 'react';
import { Box, Container } from '@chakra-ui/react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" py={8} px={4}>
      <Container maxW="container.xl">
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout; 