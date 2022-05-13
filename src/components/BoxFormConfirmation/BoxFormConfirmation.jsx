import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import styles from './BoxFormConfirmation.module.css';

const BoxFormConfirmation = ({ pickup }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles['box-form-confirmation-page']}>
      <CheckCircleIcon className={styles['confirmation-check-circle']} color="#345E80" />
      <Text className={styles['confirmation-text']} textStyle="header-1">
        Your {pickup ? 'found' : 'launch'} box request has been confirmed!
      </Text>
      <Text
        className={styles['confirmation-message']}
        size="md"
        fontWeight="normal"
        textStyle="header-2"
      >
        Please allow 1-3 business days for your request to be reviewed. You will receive more
        information via email.
      </Text>
      <Button
        className={styles['confirmation-button']}
        size="sm"
        colorScheme="blue"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>
    </div>
  );
};

BoxFormConfirmation.propTypes = {
  pickup: PropTypes.bool.isRequired,
};

export default BoxFormConfirmation;
