import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  UnorderedList,
  ListItem,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import { PRIVACY_POLICY } from '../../config/security';

interface PrivacyNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ isOpen, onClose, onAccept }) => {
  const [hasAccepted, setHasAccepted] = React.useState(false);

  const handleAccept = () => {
    if (hasAccepted) {
      onAccept();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Privacy Notice</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              We take your privacy seriously. Please read how we handle your personal information:
            </Text>
            <UnorderedList spacing={2}>
              <ListItem>
                Your data is stored securely and encrypted at rest.
              </ListItem>
              <ListItem>
                We retain your information for {PRIVACY_POLICY.DATA_RETENTION_PERIOD} after which it is automatically deleted.
              </ListItem>
              <ListItem>
                Your CV/Resume is stored in a secure location with restricted access.
              </ListItem>
              <ListItem>
                We only accept company email addresses from approved domains for security.
              </ListItem>
              <ListItem>
                Your data is only accessible to authorized hiring personnel.
              </ListItem>
              <ListItem>
                You have the right to request deletion of your data at any time.
              </ListItem>
            </UnorderedList>
            <Text fontWeight="bold" mt={4}>
              Data Processing:
            </Text>
            <UnorderedList spacing={2}>
              <ListItem>
                Personal information is collected solely for recruitment purposes.
              </ListItem>
              <ListItem>
                Documents are scanned for malware before storage.
              </ListItem>
              <ListItem>
                We never share your information with third parties without consent.
              </ListItem>
            </UnorderedList>
            <Checkbox
              mt={4}
              isChecked={hasAccepted}
              onChange={(e) => setHasAccepted(e.target.checked)}
            >
              I have read and accept the privacy notice
            </Checkbox>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAccept}
            isDisabled={!hasAccepted}
          >
            Accept & Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrivacyNotice; 