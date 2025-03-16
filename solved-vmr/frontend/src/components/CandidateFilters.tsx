import React from 'react';
import {
  Box,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Education, EDUCATION_OPTIONS } from '../types/candidate';

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

  const handleChange = (field: keyof FilterOptions, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      mb={4}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Filtros
        </Text>
        
        <Input
          placeholder="Buscar por nome ou email..."
          value={filters.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
        />

        <Select
          placeholder="Filtrar por educação"
          value={filters.education}
          onChange={(e) => handleChange('education', e.target.value as Education | '')}
        >
          {EDUCATION_OPTIONS.map((education) => (
            <option key={education} value={education}>
              {education}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Filtrar por experiência"
          value={filters.workExperience}
          onChange={(e) => handleChange('workExperience', e.target.value)}
        >
          <option value="0-2">0-2 anos</option>
          <option value="3-5">3-5 anos</option>
          <option value="5+">5+ anos</option>
        </Select>

        <HStack>
          <Button
            colorScheme="blue"
            onClick={() => onFilterChange(filters)}
            flex={1}
          >
            Aplicar Filtros
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            flex={1}
          >
            Limpar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CandidateFilters; 