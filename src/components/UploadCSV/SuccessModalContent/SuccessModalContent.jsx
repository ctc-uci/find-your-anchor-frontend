import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from '@chakra-ui/react';
import './SuccessModalContent.css';
import { CheckCircleIcon } from '@chakra-ui/icons';

const SuccessModalContent = ({ CSVFileName, setIsUploadingNewFile, onEditViewFile }) => {
  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
  };

  const viewFile = e => {
    setIsUploadingNewFile(false);
    onEditViewFile(e);
  };

  return (
    <div className="success-modal-content">
      <CheckCircleIcon alt="Check Icon" boxSize="70px" color="green.300" marginBottom="20px" />
      <p className="success-modal-text">File Uploaded!</p>
      <p className="success-modal-file-name">{CSVFileName}</p>
      <ButtonGroup className="success-modal-buttons">
        <Button color="white" bg="#1F2F38" onClick={uploadNewFile}>
          Upload New File
        </Button>
        <Button type="submit" colorScheme="teal">
          Add to Map
        </Button>
        <Button color="white" bg="#345E80" onClick={viewFile}>
          Edit/View File
        </Button>
      </ButtonGroup>
    </div>
  );
};

SuccessModalContent.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
  onEditViewFile: PropTypes.func.isRequired,
};

export default SuccessModalContent;
