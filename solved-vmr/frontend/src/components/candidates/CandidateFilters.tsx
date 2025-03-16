import React from 'react';
import {
  Box,
  Input,
  Select,
  Button,
  HStack,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Education, EDUCATION_OPTIONS } from '../../types/candidate';

interface FilterOptions {
  searchTerm: string;
  education: Education | '';
  workExperience: string;
}

interface CandidateFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const CandidateFilters: React.FC<CandidateFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (
    field: keyof FilterOptions,
    value: string
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold">Filtros</Text>
        
        <Input
          placeholder="Buscar por nome ou email..."
          value={filters.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
        />

        <Select
          placeholder="Nível de educação"
          value={filters.education}
          onChange={(e) => handleChange('education', e.target.value)}
        >
          {EDUCATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Experiência profissional"
          value={filters.workExperience}
          onChange={(e) => handleChange('workExperience', e.target.value)}
        >
          <option value="0-2">0-2 anos</option>
          <option value="3-5">3-5 anos</option>
          <option value="5+">5+ anos</option>
        </Select>

        <HStack justify="flex-end">
          <Button onClick={onReset} variant="outline">
            Limpar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CandidateFilters; 