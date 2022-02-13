import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import './ErrorModal.css';

const ErrorModal = ({ CSVFileName, setIsUploadingNewFile, uploadErrors }) => {
  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
    console.log('upload new file');
  };

  const viewFile = () => {
    setIsUploadingNewFile(false);
    console.log('edit/view file');
  };

  return (
    <div className="success-modal-container">
      {/* image */}
      <div className="success-modal-icon" />
      <p className="success-modal-text">Oops! There was an error with the uploaded file:</p>
      <p className="success-modal-file-name">{CSVFileName}</p>
      <div className="success-modal-errors">
        {/* {uploadErrors.map(error => 
          <p className="error-modal-message">key={i}>*{error}*</p>
        )} */}
        {uploadErrors[0]}
      </div>
      <div className="success-modal-buttons">
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
