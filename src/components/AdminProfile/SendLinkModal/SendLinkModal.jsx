import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Text, Input, Button } from '@chakra-ui/react';
import CheckIcon from '../../../assets/check-icon.svg';
import styles from './SendLinkModal.module.css';
import { sendInviteLink } from '../../../common/auth_utils';
import { FYABackend } from '../../../common/utils';
import SendRegistrationLinkIcon from '../../../assets/send-registration-link-icon.svg';
import CommonModal from '../../../common/CommonModal/CommonModal';
import useMobileWidth from '../../../common/useMobileWidth';
import ChakraTheme from '../../../common/ChakraTheme';

const ModalOne = ({ count, setCount, onClose }) => {
  const isMobile = useMobileWidth();
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

  if (isMobile) {
    return (
      <ChakraProvider theme={ChakraTheme}>
        <div className={styles['modal-content']}>
          <img src={SendRegistrationLinkIcon} className={styles['email-icon']} alt="Logo" />

          <Text fontSize="3xl" fontWeight="bold" className={styles['modal-header']}>
            Send Registration Link
          </Text>

          <Text fontSize="lg">
            Enter the recipient&apos;s email address and we&apos;ll send them a link to register
          </Text>
          <div className={styles['input-wrapper']}>
            <Text>Recipient Email Address</Text>
            <Input
              placeholder="celinedion@findyouranchor.us"
              value={email}
              size="lg"
              color="var(--color-gray)"
              bg="var(--color-light-gray)"
              className={styles['modal-one-input']}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <p className={styles['error-message']}>{errorMessage}</p>
          <div className={styles['modal-button-section']}>
            <Button
              onClick={handleSendLink}
              colorScheme="button"
              iconSpacing="120px"
              className={styles['modal-one-button']}
            >
              Send Link
            </Button>
            <p
              className={styles['modal-cancel-button']}
              onClick={() => onClose()}
              aria-hidden="true"
            >
              Cancel
            </p>
          </div>
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['modal-content']}>
        <img src={SendRegistrationLinkIcon} className={styles['email-icon']} alt="Logo" />

        <Text fontSize="3xl" fontWeight="bold">
          Send Registration Link
        </Text>

        <Text fontSize="lg">
          Enter the recipient&apos;s email address and we&apos;ll send them a link to register
        </Text>
        <div className={styles['input-wrapper']}>
          <Text>Recipient Email Address</Text>
          <Input
            placeholder="celinedion@findyouranchor.us"
            value={email}
            size="lg"
            color="var(--color-gray)"
            bg="var(--color-light-gray)"
            className={styles['modal-one-input']}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <p className={styles['error-message']}>{errorMessage}</p>
        <Button
          onClick={handleSendLink}
          colorScheme="button"
          iconSpacing="120px"
          className={styles['modal-one-button']}
        >
          Send Link
        </Button>
      </div>
    </ChakraProvider>
  );
};

const ModalTwo = ({ onClose }) => {
  const isMobile = useMobileWidth();

  if (isMobile) {
    return (
      <ChakraProvider theme={ChakraTheme}>
        <div className={styles['modal-content']}>
          <img src={CheckIcon} className={styles['check-icon']} alt="Logo" />
          <Text fontSize="3xl" fontWeight="bold" className={styles['modal-header']}>
            Registration Link Sent
          </Text>
          <Text fontSize="lg">
            The recipient will receive a link in their inbox to register shortly
          </Text>
          <div className={styles['modal-button-section']}>
            <Button
              onClick={() => onClose()}
              colorScheme="button"
              iconSpacing="120px"
              className={styles['modal-two-button']}
            >
              OK
            </Button>
          </div>
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['modal-content']}>
        <img src={CheckIcon} className={styles['check-icon']} alt="Logo" />
        <Text fontSize="3xl" fontWeight="bold">
          Registration Link Sent
        </Text>
        <Text fontSize="lg">
          The recipient will receive a link in their inbox to register shortly
        </Text>
        <Button
          onClick={() => onClose()}
          colorScheme="button"
          iconSpacing="120px"
          className={styles['modal-two-button']}
        >
          OK
        </Button>
      </div>
    </ChakraProvider>
  );
};

const SendLinkModalContent = ({ onClose }) => {
  const [countState, setCountState] = useState(0);

  const modalStates = [
    <ModalOne key="" count={countState} setCount={setCountState} onClose={onClose} />,
    <ModalTwo key="" onClose={onClose} />,
  ];

  return modalStates[countState];
};

const SendLinkModal = ({ isOpen, onClose }) => {
  return (
    <ChakraProvider theme={ChakraTheme}>
      <CommonModal isOpen={isOpen} onClose={onClose} modalClassName={styles['modal-body']}>
        <div className={styles['send-link-modal-content']}>
          <SendLinkModalContent onClose={onClose} />
        </div>
      </CommonModal>
    </ChakraProvider>
  );
};

ModalOne.propTypes = {
  count: PropTypes.number.isRequired,
  setCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

ModalTwo.propTypes = {
  onClose: PropTypes.func.isRequired,
};

SendLinkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

SendLinkModalContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SendLinkModal;
