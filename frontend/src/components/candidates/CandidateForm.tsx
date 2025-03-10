import React, { useState, useRef } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  Input,
  Stack,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Heading,
  Select,
  InputGroup,
  Center,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import { createStandaloneToast } from '@chakra-ui/toast';
import { CheckCircleIcon, WarningIcon, ChevronLeftIcon, AttachmentIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Education, EDUCATION_OPTIONS, ErrorState } from '../../types/candidate';
import { Helmet } from 'react-helmet-async';
import PageLayout from '../layout/PageLayout';

interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  education: Education;
  workExperience: string;
  cv?: FileList;
}

const CandidateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CandidateFormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedCandidate, setAddedCandidate] = useState<CandidateFormData | null>(null);
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
  const [error, setError] = useState<ErrorState | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedFile = watch('cv')?.[0];

  const onSubmit: SubmitHandler<CandidateFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'cv' && data.cv?.[0]) {
          formData.append('cv', data.cv[0]);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch('http://localhost:3010/api/candidates', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create candidate');
      }

      const result = await response.json();
      setAddedCandidate(result);
      onSuccessOpen();
      reset();
    } catch (error: any) {
      onErrorOpen();
      setError({
        title: 'Error',
        message: error.message || 'Failed to create candidate',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>ATS Dashboard - Add Candidate</title>
      </Helmet>
      <Box>
        <Button
          leftIcon={<ChevronLeftIcon />}
          mb={6}
          onClick={() => navigate(-1)}
          variant="ghost"
        >
          Back
        </Button>
        <Heading size="lg" mb={6} color={useColorModeValue('gray.800', 'white')}>
          Add New Candidate
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Minimum length should be 2' }
                  })}
                />
                <FormErrorMessage>
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Minimum length should be 2' }
                  })}
                />
                <FormErrorMessage>
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\+?[\d\s-]+$/,
                    message: 'Invalid phone number'
                  }
                })}
              />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.address}>
              <FormLabel>Address</FormLabel>
              <Textarea
                {...register('address', {
                  required: 'Address is required'
                })}
              />
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.education}>
              <FormLabel>Education Level</FormLabel>
              <Select
                {...register('education', {
                  required: 'Education level is required'
                })}
              >
                <option value="">Select education level</option>
                {EDUCATION_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level.replace('_', ' ')}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.education && errors.education.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.workExperience}>
              <FormLabel>Work Experience</FormLabel>
              <Textarea
                {...register('workExperience', {
                  required: 'Work experience is required',
                  minLength: {
                    value: 50,
                    message: 'Please provide at least 50 characters'
                  }
                })}
                placeholder="Describe your work experience..."
                rows={4}
              />
              <FormErrorMessage>
                {errors.workExperience && errors.workExperience.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.cv}>
              <FormLabel>CV/Resume</FormLabel>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register('cv')}
                display="none"
                ref={fileInputRef}
              />
              <Button
                leftIcon={<AttachmentIcon />}
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Upload CV
              </Button>
              {selectedFile && (
                <Text mt={2} fontSize="sm">
                  Selected file: {selectedFile.name}
                </Text>
              )}
              <FormErrorMessage>
                {errors.cv && errors.cv.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </VStack>
        </form>
      </Box>

      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <Alert status="success">
              <AlertIcon />
              <Box>
                <AlertTitle>Candidate Added Successfully!</AlertTitle>
                <AlertDescription>
                  The candidate has been added to the system.
                </AlertDescription>
              </Box>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => navigate('/candidates')}>
              View Candidates
            </Button>
            <Button variant="ghost" onClick={onSuccessClose}>
              Add Another
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isErrorOpen} onClose={onErrorClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              <Box>
                <AlertTitle>{error?.title}</AlertTitle>
                <AlertDescription>
                  {error?.message}
                </AlertDescription>
              </Box>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={onErrorClose}
              />
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onErrorClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
};

export default CandidateForm; 