import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import CandidateFilters from './CandidateFilters';
import { Candidate, Education } from '../types/candidate';

interface FilterOptions {
  searchTerm: string;
  education: Education | '';
  workExperience: string;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    education: '',
    workExperience: '',
  });

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Helper function to safely parse work experience
  const parseWorkExperience = (experience: string | null): number => {
    if (!experience) return 0;
    const years = parseInt(experience);
    return isNaN(years) ? 0 : years;
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      education: '',
      workExperience: '',
    });
  };

  const filteredCandidates = candidates.filter((candidate) => {
    // Search term filter
    const searchMatch = !filters.searchTerm || 
      (candidate.firstName || '').toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (candidate.lastName || '').toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (candidate.email || '').toLowerCase().includes(filters.searchTerm.toLowerCase());

    // Education filter
    const educationMatch = !filters.education || 
      candidate.education === filters.education;

    // Work experience filter
    const years = parseWorkExperience(candidate.workExperience);
    const workExperienceMatch = !filters.workExperience || 
      (filters.workExperience === '0-2' && years <= 2) ||
      (filters.workExperience === '3-5' && years > 2 && years <= 5) ||
      (filters.workExperience === '5+' && years > 5);

    return searchMatch && educationMatch && workExperienceMatch;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <CandidateFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <Box
        overflowX="auto"
        bg={bgColor}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Telefone</Th>
              <Th>Educação</Th>
              <Th>Experiência</Th>
              <Th>CV</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCandidates.map((candidate) => (
              <Tr key={candidate.id}>
                <Td>{`${candidate.firstName} ${candidate.lastName}`}</Td>
                <Td>{candidate.email}</Td>
                <Td>{candidate.phoneNumber || '-'}</Td>
                <Td>{candidate.education || '-'}</Td>
                <Td>{candidate.workExperience || '-'}</Td>
                <Td>
                  {candidate.cvUrl ? (
                    <a
                      href={`http://localhost:3010${candidate.cvUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3182ce' }}
                    >
                      Ver CV
                    </a>
                  ) : (
                    '-'
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredCandidates.length === 0 && (
        <Text textAlign="center" p={4}>
          Nenhum candidato encontrado com os filtros atuais.
        </Text>
      )}
    </VStack>
  );
};

export default CandidateList; 