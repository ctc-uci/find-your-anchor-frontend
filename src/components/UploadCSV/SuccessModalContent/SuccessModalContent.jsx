import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import styles from './SuccessModalContent.module.css';
import useMobileWidth from '../../../common/useMobileWidth';

const SuccessModalContent = ({ CSVFileName, setIsUploadingNewFile, onEditViewFile }) => {
  const isMobile = useMobileWidth();

  const uploadNewFile = () => {
    setIsUploadingNewFile(true);
  };

  const viewFile = () => {
    setIsUploadingNewFile(false);
    onEditViewFile();
  };

  if (!isMobile) {
    return (
      <div className={styles['success-modal-content']}>
        <CheckCircleIcon alt="Check Icon" boxSize="70px" color="green.300" marginBottom="20px" />
        <p className={styles['success-modal-text']}>File Uploaded!</p>
        <p className={styles['success-modal-file-name']}>{CSVFileName}</p>
        <ButtonGroup className={styles['success-modal-buttons']}>
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
  }

  return (
    <Flex flexDirection="column" justifyContent="space-between" gap="15px" marginTop="20px">
      <Flex gap="10px" marginTop="4px">
        <CheckCircleIcon alt="Check Icon" boxSize="20px" color="green.300" marginTop="4px" />
        <Text fontSize="xl" fontWeight="bold">
          File Uploaded Successfully
        </Text>
      </Flex>
      <ButtonGroup className={styles['success-modal-buttons']}>
        <Button type="submit" colorScheme="teal">
          Add to Map
        </Button>
        <Button color="white" bg="#345E80" onClick={viewFile}>
          Edit/View File
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

SuccessModalContent.propTypes = {
  CSVFileName: PropTypes.string.isRequired,
  setIsUploadingNewFile: PropTypes.func.isRequired,
  onEditViewFile: PropTypes.func.isRequired,
};

export default SuccessModalContent;
