import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { ButtonGroup, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CommonModal from '../../../common/CommonModal/CommonModal';

import styles from './ExportSuccessModal.module.css';

const ExportSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} className={styles['common-modal']}>
      <div className={styles['export-success-modal-content']}>
        <CheckCircleIcon alt="Check Icon" boxSize="80px" color="green.300" marginBottom="20px" />
        <Text className={styles['export-success-modal-heading']}>Export Successful!</Text>
        <Text className={styles['export-success-modal-text']}>
          Your CSV file is now available to view.
        </Text>
        <ButtonGroup className={styles['export-success-modal-buttons']}>
          <Button type="submit" colorScheme="teal" onClick={() => navigate('/admin')}>
            Back to Home
          </Button>
        </ButtonGroup>
      </div>
    </CommonModal>
  );
};

ExportSuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportSuccessModal;
