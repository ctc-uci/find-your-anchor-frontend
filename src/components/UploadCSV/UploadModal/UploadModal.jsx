import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import DropZone from '../DropZone/DropZone';
import './UploadModal.css';

const UploadModal = ({ setCSVFile, onSubmit }) => {
  return (
    <>
      <h1 className="upload-modal-title">UPLOAD CSV FILE:</h1>
      <DropZone setFile={setCSVFile} />
      <Button
        className="upload-modal-button"
        type="submit"
        size="md"
        colorScheme="teal"
        onClick={e => onSubmit(e)}
      >
        Confirm Upload
      </Button>
    </>
  );
};

UploadModal.propTypes = {
  setCSVFile: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UploadModal;
