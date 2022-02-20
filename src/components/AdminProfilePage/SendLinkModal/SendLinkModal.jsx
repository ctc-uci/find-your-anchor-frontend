import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ChakraProvider,
  Text,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import Checkmark from '../../../assets/Check.png';
import './SendLinkModal.css';

const ModalOne = ({ count, setCount }) => {
  return (
    <div className="modal-content">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Send registration link via email:
      </Text>
      <Textarea placeholder="ex: jdoeFYA@gmail.com" />
      <Button onClick={() => setCount(count + 1)} color="white" bg="#345E80" iconSpacing="120px">
        Send Link
      </Button>
    </div>
  );
};

const ModalTwo = () => (
  <div className="modal-content">
    <img src={Checkmark} alt="Green Checkmark" className="checkmark" />
    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
      LINK SENT!
    </Text>
    <Text color="#3182CE" textAlign="center">
      Recipient will receive link in their inbox shortly...
    </Text>
    <Button color="white" bg="#1F2F38">
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
