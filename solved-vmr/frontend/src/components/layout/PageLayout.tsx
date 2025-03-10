import React from 'react';
import {
  Box,
  Container,
  HStack,
  Button,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, showBackButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh" transition="background-color 0.2s">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            {showBackButton && location.pathname !== '/' && (
              <Button
                leftIcon={<ChevronLeftIcon />}
                variant="ghost"
                size="md"
                width="fit-content"
                onClick={() => navigate('/')}
                aria-label="Return to dashboard"
              >
                Return to Dashboard
              </Button>
            )}
            <Box ml="auto">
              <ThemeToggle />
            </Box>
          </HStack>
          {children}
        </VStack>
      </Container>
    </Box>
  );
};

export default PageLayout; 