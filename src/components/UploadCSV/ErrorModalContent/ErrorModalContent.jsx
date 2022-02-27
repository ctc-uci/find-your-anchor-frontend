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

  const viewFile = e => {
    setIsUploadingNewFile(false);
    onEditViewFile(e);
  };

  return (
    <div className={styles['error-modal-content']}>
      <WarningIcon alt="Icon" boxSize="70px" color="red" marginBottom="20px" />
      <Text className="error-modal-text">Oops!</Text>
      <p className={styles['error-modal-text']}>There was an error with the uploaded file:</p>
      <p className={styles['error-modal-file-name']}>{CSVFileName}</p>
      <div className={styles['error-modal-errors']}>
        {uploadErrors.map((error, index) => (
          /* eslint-disable react/no-array-index-key */
          <p className={styles['error-modal-message']} key={index}>
            *{error}*
          </p>
        ))}
      </div>
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
