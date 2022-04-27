import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ChakraProvider,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import Checkmark from '../../../assets/Check.png';
import styles from './SendLinkModal.module.css';
import { sendInviteLink } from '../../../common/auth_utils';
import { FYABackend } from '../../../common/utils';
import SendRegistrationLinkIcon from '../../../assets/send-registration-link-icon.svg';

const ModalOne = ({ count, setCount }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendLink = async e => {
    try {
      e.preventDefault();
      const backendUser = await FYABackend.get(`/users/email/${email}`);
      if (backendUser.data.user) {
        throw new Error('This email is already in use. Please enter a new email address.');
      }
      await sendInviteLink(email);
      setErrorMessage('');
      setEmail('');
      setCount(count + 1);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={styles['modal-content']}>
      <Text fontSize="2xl" fontWeight="bold">
        Send Registration Link
      </Text>
      <Text fontSize="lg">
        Enter the recipient&apos;s email address and we&apos;ll send them a link to register
      </Text>
      <div className={styles['input-wrapper']}>
        <Text>Recipient Email Address</Text>
        <Input
          placeholder="name@findyouranchor.us"
          value={email}
          size="lg"
          color="#7D7D7D"
          bg="#F6F6F6"
          className={styles['modal-one-input']}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <p className={styles['error-message']}>{errorMessage}</p>
      <Button
        onClick={handleSendLink}
        color="white"
        bg="#345E80"
        iconSpacing="120px"
        className={styles['modal-one-button']}
      >
        Send Link
      </Button>
    </div>
  );
};

const ModalTwo = () => (
  <div className={styles['modal-content']}>
    <img src={Checkmark} alt="Green Checkmark" className={styles.checkmark} />
    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
      LINK SENT!
    </Text>
    <Text color="#3182CE" textAlign="center">
      Recipient will receive link in their inbox shortly...
    </Text>
    <Button color="white" bg="#1F2F38" className={styles['modal-two-button']}>
      Resend Link
    </Button>
  </div>
);

const SendLinkModalContent = () => {
  const [countState, setCountState] = useState(0);

  const modalStates = [
    <ModalOne key="" count={countState} setCount={setCountState} />,
    <ModalTwo key="" />,
  ];

  return modalStates[countState];
};

const SendLinkModal = ({ isOpen, onClose }) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className={styles['send-link-modal-content']}>
              <img src={SendRegistrationLinkIcon} className={styles['email-icon']} alt="Logo" />
              <SendLinkModalContent />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

ModalOne.propTypes = {
  count: PropTypes.number.isRequired,
  setCount: PropTypes.number.isRequired,
};

SendLinkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SendLinkModal;
