import React, { useState, useRef } from 'react';
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
import { Education, EDUCATION_OPTIONS } from '../../types/candidate';
import PageLayout from '../layout/PageLayout';
import config from '../../config';

const { toast } = createStandaloneToast();

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

interface ErrorState {
  title: string;
  message: string;
  type: 'server' | 'validation' | 'network' | 'unknown';
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
  const [addedCandidate, setAddedCandidate] = useState<any>(null);
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
  const [error, setError] = useState<ErrorState | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedFile = watch('cv')?.[0];

  const handleModalClose = () => {
    onSuccessClose();
    reset();
  };

  const getErrorDetails = (error: any): ErrorState => {
    if (!navigator.onLine) {
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        type: 'network'
      };
    }

    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      return {
        title: 'Server Connection Error',
        message: 'Unable to connect to the server. Please try again later or contact support if the problem persists.',
        type: 'server'
      };
    }

    if (error.message?.includes('already exists')) {
      return {
        title: 'Validation Error',
        message: error.message,
        type: 'validation'
      };
    }

    return {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
      type: 'unknown'
    };
  };

  const onSubmit = async (data: CandidateFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'cv' && data.cv?.[0]) {
          formData.append('cv', data.cv[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      console.log('Submitting form data:', {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        cv: formData.get('cv'),
      });

      const response = await fetch(`${config.apiUrl}/api/candidates`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create candidate' }));
        throw new Error(errorData.error || 'Failed to create candidate');
      }

      const result = await response.json();
      console.log('Success:', result);
      
      if (result.cvUrl) {
        result.cvUrl = `${config.apiUrl}${result.cvUrl}`;
      }
      
      setAddedCandidate(result);
      
      toast({
        title: 'Success',
        description: 'Candidate added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSuccessOpen();
    } catch (error: any) {
      console.error('Error details:', error);
      const errorDetails = getErrorDetails(error);
      setError(errorDetails);
      onErrorOpen();
      
      toast({
        title: errorDetails.title,
        description: errorDetails.message,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Box>
        <Heading size="lg" mb={6} color={useColorModeValue('gray.800', 'white')}>
          Add New Candidate
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input
                {...register('firstName', { required: 'First name is required' })}
              />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                {...register('lastName', { required: 'Last name is required' })}
              />
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Phone Number</FormLabel>
              <Input {...register('phoneNumber')} />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.address}>
              <FormLabel>Address</FormLabel>
              <Input {...register('address')} />
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.education}>
              <FormLabel>Education</FormLabel>
              <Select
                {...register('education', { required: 'Education is required' })}
                placeholder="Select education level"
              >
                {EDUCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.education && errors.education.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.workExperience}>
              <FormLabel>Work Experience</FormLabel>
              <Textarea {...register('workExperience')} />
              <FormErrorMessage>
                {errors.workExperience && errors.workExperience.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>CV Upload</FormLabel>
              <InputGroup>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                  {...register('cv')}
                  ref={(e) => {
                    register('cv').ref(e);
                    fileInputRef.current = e;
                  }}
                />
                <Center
                  w="full"
                  h="100px"
                  borderWidth={2}
                  borderRadius="md"
                  borderStyle="dashed"
                  borderColor={selectedFile ? "green.500" : "gray.200"}
                  bg={selectedFile ? "green.50" : "gray.50"}
                  _hover={{
                    borderColor: "blue.500",
                    bg: "blue.50",
                  }}
                  cursor="pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <VStack spacing={2}>
                    <Icon
                      as={selectedFile ? CheckCircleIcon : AttachmentIcon}
                      w={6}
                      h={6}
                      color={selectedFile ? "green.500" : "gray.400"}
                    />
                    <Text color={selectedFile ? "green.600" : "gray.600"} textAlign="center">
                      {selectedFile ? (
                        <>
                          Selected: <strong>{selectedFile.name}</strong>
                          <Text fontSize="sm" color="gray.500">
                            Click to change file
                          </Text>
                        </>
                      ) : (
                        <>
                          Drag and drop your CV here or click to browse
                          <Text fontSize="sm" color="gray.500">
                            Supports PDF, DOCX (max 5MB)
                          </Text>
                        </>
                      )}
                    </Text>
                  </VStack>
                </Center>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              width="full"
            >
              Add Candidate
            </Button>
          </Stack>
        </form>
      </Box>

      <Modal isOpen={isSuccessOpen} onClose={handleModalClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center">
            <CheckCircleIcon color="green.500" mr={2} />
            Candidate Added Successfully
          </ModalHeader>
          <ModalBody>
            <VStack align="stretch" spacing={3}>
              <Text><strong>Name:</strong> {addedCandidate?.firstName} {addedCandidate?.lastName}</Text>
              <Text><strong>Email:</strong> {addedCandidate?.email}</Text>
              {addedCandidate?.phoneNumber && (
                <Text><strong>Phone:</strong> {addedCandidate.phoneNumber}</Text>
              )}
              {addedCandidate?.cvUrl && (
                <Text><strong>CV:</strong> Uploaded successfully</Text>
              )}
              <Text color="gray.600" fontSize="sm">
                The candidate has been successfully added to the ATS system.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleModalClose}>
              Add Another Candidate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isErrorOpen} onClose={onErrorClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center">
            <WarningIcon color="red.500" mr={2} />
            {error?.title || 'Error'}
          </ModalHeader>
          <ModalBody>
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
              py={4}
            >
              <AlertIcon boxSize="6" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {error?.title}
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                {error?.message}
                {error?.type === 'server' && (
                  <Text mt={2} fontSize="sm">
                    Error Code: SERVER_CONNECTION_ERROR
                  </Text>
                )}
                {error?.type === 'network' && (
                  <Text mt={2} fontSize="sm">
                    Please check your network connection and try again.
                  </Text>
                )}
              </AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => {
              onErrorClose();
              setError(null);
            }}>
              Close
            </Button>
            <Button variant="ghost" onClick={() => {
              onErrorClose();
              setError(null);
              handleSubmit(onSubmit)();
            }}>
              Try Again
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
};

export default CandidateForm;