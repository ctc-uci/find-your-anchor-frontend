import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import CSVDropZone from '../CSVDropZone/CSVDropZone';
import styles from './UploadModalContent.module.css';
import useMobileWidth from '../../../common/useMobileWidth';

const UploadModalContent = ({ setCSVFile, onUpload }) => {
  const isMobile = useMobileWidth();
  return (
    <div className={styles['upload-modal-content']}>
      <Text className={styles['upload-modal-title']}>Upload CSV File</Text>
      <CSVDropZone setFile={setCSVFile} />
      <Button
        className={styles['upload-modal-button']}
        size="md"
        color="white"
        bg="#345E80"
        onClick={e => onUpload(e)}
        isFullWidth={isMobile}
      >
        Confirm Upload
      </Button>
    </div>
  );
};

UploadModalContent.propTypes = {
  setCSVFile: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default UploadModalContent;
