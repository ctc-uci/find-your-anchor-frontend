import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@chakra-ui/react';
import './ErrorModal.css';

const ErrorModal = ({ CSVFileName, setIsUploadingNewFile, uploadErrors }) => {
  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
  };

  const viewFile = () => {
    setIsUploadingNewFile(false);
  };

  return (
    <div className="error-modal-container">
      <div className="modal-icon error-modal-icon" />
      <p className="error-modal-text">Oops!</p>
      <p className="error-modal-text">There was an error with the uploaded file:</p>
      <p className="error-modal-file-name">{CSVFileName}</p>
      <div className="error-modal-errors">
        {uploadErrors.map(error => {
          const id = uuidv4();
          return (
            <p className="error-modal-message" key={id}>
              *{error}*
            </p>
          );
        })}
      </div>
      <div className="error-modal-buttons">
        <Button size="md" colorScheme="blackAlpha" onClick={uploadNewFile}>
          Upload New File
        </Button>
        <Button size="md" colorScheme="teal" onClick={e => viewFile(e)}>
          Edit/View File
        </Button>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
  uploadErrors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
};

export default ErrorModal;
