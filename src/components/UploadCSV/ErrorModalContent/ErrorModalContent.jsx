import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import styles from './ErrorModalContent.module.css';

const ErrorModalContent = ({
  CSVFileName,
  setIsUploadingNewFile,
  uploadErrors,
  onEditViewFile,
}) => {
  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
  };

  const viewFile = () => {
    setIsUploadingNewFile(false);
    onEditViewFile();
  };

  return (
    <div className={styles['error-modal-content']}>
      <WarningIcon alt="Icon" boxSize="70px" color="red" marginBottom="20px" />
      <Text className={styles['error-modal-text']}>Oops!</Text>
      <p>
        {' '}
        There were <span className={styles['error-modal-red-text']}>{uploadErrors.length}</span>
        errors with the uploaded file:{' '}
      </p>
      <p className={styles['error-modal-file-name']}>{CSVFileName}</p>
      <ButtonGroup className={styles['error-modal-buttons']}>
        <Button size="md" color="white" bg="#1F2F38" onClick={uploadNewFile}>
          Upload New File
        </Button>
        <Button size="md" color="white" bg="#345E80" onClick={viewFile}>
          Edit/View File
        </Button>
      </ButtonGroup>
    </div>
  );
};

ErrorModalContent.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
  uploadErrors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
  onEditViewFile: PropTypes.func.isRequired,
};

export default ErrorModalContent;
