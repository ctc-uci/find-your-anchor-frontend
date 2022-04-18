/* eslint-disable react/no-unescaped-entities */
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
import MailIcon from '../../../assets/email-image.png';
import styles from './SendLinkModal.module.css';
import { sendInviteLink } from '../../../common/auth_utils';
import { FYABackend } from '../../../common/utils';
import CommonConfirmationPage from '../../../common/CommonConfirmationPage/CommonConfirmationPage';

// WILL NEED TO FIND A WAY TO CHANGE THE BUTTON TO CLOSE THE MODAL

const SendLinkModalContent = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleSendLink = async e => {
    try {
      e.preventDefault();
      const backendUser = await FYABackend.get(`/users/email/${email}`);
      if (backendUser.data.user) {
        throw new Error('This email is already in use. Please enter a new email address.');
      }
      await sendInviteLink(email);
      setOpenConfirmation(true);
      setErrorMessage('');
      setEmail('');
    } catch (err) {
      setErrorMessage(err.message);
      console.log(errorMessage);
    }
  };

  return (
    <div className={styles['modal-content']}>
      <img src={MailIcon} alt="Blue Mail Icon" className={styles.checkmark} />

      <Text fontSize="30px" fontWeight="bold">
        Share Registration Link
      </Text>

      <Text fontSize="18px" style={{ alignSelf: 'flex-start' }}>
        Enter the recipient's email-address and we'll send them a link to register
      </Text>

      <div className={styles['form-input']}>
        <Text fontSize="17px">Recipient Email Address</Text>
        <Input
          placeholder="e.g.: name@findyouranchor.us"
          value={email}
          size="lg"
          color="#7D7D7D"
          bg="#F6F6F6"
          className={styles['modal-one-input']}
          onChange={e => setEmail(e.target.value)}
        />
        <p className={styles['error-message']}>{errorMessage}</p>
      </div>
      <Button
        onClick={handleSendLink}
        color="white"
        bg="#345E80"
        iconSpacing="120px"
        className={styles['modal-one-button']}
      >
        Send Link
      </Button>
      <CommonConfirmationPage
        isOpen={openConfirmation}
        confirmationTitle="Registration Link Sent"
        confirmationText="The recipient will receive a link in their inbox to register shortly"
      />
    </div>
  );
};

const SendLinkModal = ({ isOpen, onClose }) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <SendLinkModalContent />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

SendLinkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SendLinkModal;
