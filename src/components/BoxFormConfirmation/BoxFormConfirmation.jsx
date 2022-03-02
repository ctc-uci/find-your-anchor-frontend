import React from 'react';
import { Button, Heading } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import styles from './BoxFormConfirmation.module.css';

const BoxFormConfirmation = pickup => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles['box-form-confirmation-page']}>
      <CheckCircleIcon className={styles['confirmation-check-circle']} color="#3182CE" />
      <Heading className={styles['confirmation-text']} size="xl" fontWeight="normal">
        Confirmed!
      </Heading>
      <Heading className={styles['confirmation-text']} size="md" fontWeight="normal">
        Your {pickup ? 'pickup' : 'relocation'} request has been confirmed!
      </Heading>
      <Heading className={styles['confirmation-text']} size="sm" fontWeight="normal">
        Please allow 1-3 business days for your request to be reviewed. You will receive more
        information via email.
      </Heading>
      <Button
        className={styles['confirmation-button']}
        size="sm"
        colorScheme="teal"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default BoxFormConfirmation;
