import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button, ButtonGroup, Text } from '@chakra-ui/react';

import './ErrorModal.css';
import ErrorIcon from '../../../assets/error.png';

const ErrorModal = ({ CSVFileName, setIsUploadingNewFile, uploadErrors, onEditViewFile }) => {
  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
  };

  const viewFile = e => {
    setIsUploadingNewFile(false);
    onEditViewFile(e);
  };

  return (
    <div className="error-modal-content">
      <img src={ErrorIcon} alt="Icon" className="error-modal-icon" />
      <Text className="error-modal-text">Oops!</Text>
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
      <ButtonGroup className="error-modal-buttons">
        <Button size="md" color="white" bg="#1F2F38" onClick={uploadNewFile}>
          Upload New File
        </Button>
        <Button size="md" color="white" bg="#345E80" onClick={e => viewFile(e)}>
          Edit/View File
        </Button>
      </ButtonGroup>
    </div>
  );
};

ErrorModal.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
  uploadErrors: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
  onEditViewFile: PropTypes.func.isRequired,
};

export default ErrorModal;
