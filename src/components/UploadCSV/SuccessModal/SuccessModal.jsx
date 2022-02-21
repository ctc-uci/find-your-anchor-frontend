import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from '@chakra-ui/react';
import './SuccessModal.css';
import SuccessIcon from '../../../assets/success.png';

const SuccessModal = ({ CSVFileName, setIsUploadingNewFile }) => {
  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
  };

  const viewFile = () => {
    setIsUploadingNewFile(false);
  };

  return (
    <div className="success-modal-content">
      <img src={SuccessIcon} alt="Icon" className="success-modal-icon" />
      <p className="success-modal-text">File Uploaded!</p>
      <p className="success-modal-file-name">{CSVFileName}</p>
      <ButtonGroup className="success-modal-buttons">
        <Button color="white" bg="#1F2F38" onClick={uploadNewFile}>
          Upload New File
        </Button>
        <Button type="submit" colorScheme="teal" onClick={e => viewFile(e)}>
          Add to Map
        </Button>
        <Button color="white" bg="#345E80" onClick={e => viewFile(e)}>
          Edit/View File
        </Button>
      </ButtonGroup>
    </div>
  );
};

SuccessModal.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
};

export default SuccessModal;
