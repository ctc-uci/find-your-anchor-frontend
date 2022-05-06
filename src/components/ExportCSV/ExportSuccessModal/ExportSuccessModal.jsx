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
        <CheckCircleIcon className={styles['confirmation-icon']} w={24} h={24} color="#345E80" />
        <Text className={styles['export-success-modal-heading']}>Export Successful!</Text>
        <Text className={styles['export-success-modal-text']}>
          Your CSV file is now available to view.
        </Text>
        <ButtonGroup className={styles['export-success-modal-buttons']}>
          <Button type="submit" colorScheme="teal" onClick={() => navigate('/')}>
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
