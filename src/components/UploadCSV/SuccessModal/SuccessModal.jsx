import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import './SuccessModal.css';

const SuccessModal = ({ CSVFileName, setIsUploadingNewFile }) => {
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
      <p className="success-modal-text">File Uploaded!</p>
      <p className="success-modal-file-name">{CSVFileName}</p>
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

SuccessModal.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
};

export default SuccessModal;
