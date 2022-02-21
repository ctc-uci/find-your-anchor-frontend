import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@chakra-ui/react';
import DropZone from '../DropZone/DropZone';
import './UploadModal.css';

const UploadModal = ({ setCSVFile, onUpload }) => {
  return (
    <div className="upload-modal-content">
      <Text className="upload-modal-title">UPLOAD CSV FILE:</Text>
      <DropZone setFile={setCSVFile} />
      <Button
        className="upload-modal-button"
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

UploadModal.propTypes = {
  setCSVFile: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default UploadModal;
