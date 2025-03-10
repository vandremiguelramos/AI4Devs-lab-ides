import React from 'react';
import { Box, Button, Heading, SimpleGrid, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { AddIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import PageLayout from './layout/PageLayout';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');

  return (
    <PageLayout showBackButton={false}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2} color={headingColor}>ATS Dashboard</Heading>
          <Text color={textColor}>Manage your candidates efficiently</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            borderColor={cardBorder}
            bg={cardBg}
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => navigate('/add-candidate')}
            role="button"
            aria-label="Add new candidate"
          >
            <VStack spacing={4}>
              <Box
                p={4}
                borderRadius="full"
                bg="blue.50"
                color="blue.500"
                _dark={{
                  bg: 'blue.900',
                  color: 'blue.200',
                }}
              >
                <AddIcon boxSize={8} />
              </Box>
              <Heading size="md" color={headingColor}>Add Candidate</Heading>
              <Text color={textColor} textAlign="center">
                Add a new candidate to the ATS system with their details and CV
              </Text>
              <Button
                colorScheme="blue"
                leftIcon={<AddIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/add-candidate');
                }}
                width="full"
              >
                Add New Candidate
              </Button>
            </VStack>
          </Box>

          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            borderColor={cardBorder}
            bg={cardBg}
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => navigate('/candidates')}
            role="button"
            aria-label="View all candidates"
          >
            <VStack spacing={4}>
              <Box
                p={4}
                borderRadius="full"
                bg="green.50"
                color="green.500"
                _dark={{
                  bg: 'green.900',
                  color: 'green.200',
                }}
              >
                <ViewIcon boxSize={8} />
              </Box>
              <Heading size="md" color={headingColor}>View Candidates</Heading>
              <Text color={textColor} textAlign="center">
                View and manage all candidates in the system
              </Text>
              <Button
                colorScheme="green"
                leftIcon={<ViewIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/candidates');
                }}
                width="full"
              >
                View All Candidates
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </PageLayout>
  );
};

export default Dashboard; 