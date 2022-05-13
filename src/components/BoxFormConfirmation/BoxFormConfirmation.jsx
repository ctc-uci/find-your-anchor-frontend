import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './BoxFormConfirmation.module.css';
import CheckIcon from '../../assets/check-icon.svg';
import useMobileWidth from '../../common/useMobileWidth';

const BoxFormConfirmation = ({ pickup }) => {
  const navigate = useNavigate();
  const isMobile = useMobileWidth();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles['box-form-confirmation-page']}>
      <img src={CheckIcon} className={styles['check-icon']} alt="Logo" />
      <Text
        className={styles['confirmation-text']}
        fontWeight="bold"
        textStyle={isMobile ? 'subheader' : 'header-1'}
      >
        Your {pickup ? 'found' : 'launch'} box request has been confirmed!
      </Text>
      <Text
        className={styles['confirmation-message']}
        size="md"
        fontWeight="normal"
        textStyle={isMobile ? 'body' : 'subheader'}
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
