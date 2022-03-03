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

const ModalOne = ({ count, setCount }) => {
  return (
    <div className={styles['modal-content']}>
      <Text fontSize="xl" fontWeight="bold" style={{ alignSelf: 'flex-start' }}>
        Send registration link via email:
      </Text>
      <Input
        placeholder="ex: jdoeFYA@gmail.com"
        size="lg"
        color="#7D7D7D"
        bg="#F6F6F6"
        className={styles['modal-one-input']}
      />
      <Button
        onClick={() => setCount(count + 1)}
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
            <div>
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
