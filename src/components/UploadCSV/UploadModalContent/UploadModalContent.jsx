import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import CSVDropZone from '../CSVDropZone/CSVDropZone';
import styles from './UploadModalContent.module.css';
import useMobileWidth from '../../../common/useMobileWidth';

const UploadModalContent = ({ setCSVFile, onUpload }) => {
  const isMobile = useMobileWidth();
  const navigate = useNavigate();

  return (
    <div className={styles['upload-modal-content']}>
      {isMobile && (
        <IconButton
          background="transparent"
          color="var(--color-black)"
          icon={<ChevronLeftIcon h={50} w={50} />}
          onClick={() => navigate('/')}
          className={styles['upload-modal-back-button']}
        />
      )}
      <Text className={styles['upload-modal-title']}>Upload CSV File</Text>
      <CSVDropZone setFile={setCSVFile} />
      <Button
        className={styles['upload-modal-button']}
        size="md"
        color="var(--color-white)"
        bg="var(--color-teal)"
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
