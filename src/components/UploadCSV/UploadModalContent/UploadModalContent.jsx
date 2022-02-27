import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import DropZone from '../DropZone/DropZone';
import styles from './UploadModalContent.module.css';

const UploadModalContent = ({ setCSVFile, onUpload }) => {
  return (
    <div className={styles['upload-modal-content']}>
      <Text className={styles['upload-modal-title']}>UPLOAD CSV FILE:</Text>
      <DropZone setFile={setCSVFile} />
      <Button
        className={styles['upload-modal-button']}
        size="md"
        color="white"
        bg="#345E80"
        onClick={e => onUpload(e)}
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
