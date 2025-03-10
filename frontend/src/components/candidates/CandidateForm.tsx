import React, { useState, useRef, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import DOMPurify from 'dompurify';
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
  useToast,
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
import PrivacyNotice from '../privacy/PrivacyNotice';
import { SECURITY_CONFIG, PRIVACY_POLICY, validateEmail, sanitizePhoneNumber, isFileSecure } from '../../config/security';

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
    setError,
    setValue,
  } = useForm<CandidateFormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedCandidate, setAddedCandidate] = useState<CandidateFormData | null>(null);
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
  const { isOpen: isPrivacyOpen, onOpen: onPrivacyOpen, onClose: onPrivacyClose } = useDisclosure();
  const [error, setError] = useState<ErrorState | null>(null);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedFile = watch('cv')?.[0];
  const toast = useToast();

  // Session timeout handler
  useEffect(() => {
    const timeout = setTimeout(() => {
      toast({
        title: 'Session Timeout',
        description: 'Your session has expired for security reasons. Please refresh the page.',
        status: 'warning',
        duration: null,
        isClosable: true,
      });
      reset();
    }, SECURITY_CONFIG.SESSION_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [toast, reset]);

  const validateFormData = (data: CandidateFormData): boolean => {
    let isValid = true;

    if (!validateEmail(data.email)) {
      setError('email', {
        type: 'validate',
        message: 'Only company email addresses are allowed'
      });
      isValid = false;
    }

    if (data.cv?.[0] && !isFileSecure(data.cv[0])) {
      setError('cv', {
        type: 'validate',
        message: `File must be a PDF or Word document under ${SECURITY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
      isValid = false;
    }

    return isValid;
  };

  const sanitizeData = (data: CandidateFormData): CandidateFormData => {
    return {
      ...data,
      firstName: DOMPurify.sanitize(data.firstName).trim(),
      lastName: DOMPurify.sanitize(data.lastName).trim(),
      email: DOMPurify.sanitize(data.email).trim(),
      phoneNumber: sanitizePhoneNumber(DOMPurify.sanitize(data.phoneNumber)),
      address: DOMPurify.sanitize(data.address).trim(),
      workExperience: DOMPurify.sanitize(data.workExperience).trim(),
      education: data.education,
    };
  };

  const handlePrivacyAccept = () => {
    setHasAcceptedPrivacy(true);
  };

  const onSubmit: SubmitHandler<CandidateFormData> = async (data) => {
    if (!hasAcceptedPrivacy) {
      onPrivacyOpen();
      return;
    }

    if (!validateFormData(data)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const sanitizedData = sanitizeData(data);
      const formData = new FormData();

      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (key === 'cv' && data.cv?.[0]) {
          formData.append('cv', data.cv[0]);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(`${SECURITY_CONFIG.API_BASE_URL}/api/candidates`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'include',
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
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
        <meta name="csrf-token" content="your-csrf-token" />
      </Helmet>
      {/* ... rest of the form JSX ... */}

      <PrivacyNotice
        isOpen={isPrivacyOpen}
        onClose={onPrivacyClose}
        onAccept={handlePrivacyAccept}
      />
    </PageLayout>
  );
};

export default CandidateForm; 