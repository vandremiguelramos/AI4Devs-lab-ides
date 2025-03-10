import React from 'react';
import { Box, Button, Heading, SimpleGrid, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { AddIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from './layout/PageLayout';

const Dashboard: React.FC = () => {
  // ... existing code ...

  return (
    <PageLayout showBackButton={false}>
      <Helmet>
        <title>ATS Dashboard - Home</title>
      </Helmet>
      {/* ... rest of the existing JSX ... */}
    </PageLayout>
  );
};

export default Dashboard; 