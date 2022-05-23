import React from 'react';
import PropTypes from 'prop-types';
import { Button, Flex, Text, Image } from '@chakra-ui/react';
import SuccessCheckIcon from '../../../assets/Check.png';
import styles from './SuccessModalContent.module.css';
import useMobileWidth from '../../../common/useMobileWidth';

const SuccessModalContent = ({ setIsUploadingNewFile, onEditViewFile, isLoading }) => {
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
        <Image mb={7} boxSize="90px" src={SuccessCheckIcon} alt="Success Icon" />
        <Text mb={5} className={styles['success-modal-text']}>
          File Uploaded Successfully
        </Text>
        <Flex gap={10} mt={10}>
          <Button color="white" bg="#1F2F38" onClick={uploadNewFile}>
            Upload New File
          </Button>
          <Button type="submit" colorScheme="teal" isLoading={isLoading}>
            Add to Map
          </Button>
          <Button color="white" bg="#345E80" onClick={viewFile}>
            View File
          </Button>
        </Flex>
      </div>
    );
  }

  return (
    <Flex flexDirection="column" justifyContent="space-between" gap="15px" marginTop="20px">
      <Flex gap="10px" marginTop="4px">
        <Image boxSize="30px" src={SuccessCheckIcon} alt="Success Icon" />
        <Text fontSize="xl" fontWeight="bold">
          File Uploaded Successfully
        </Text>
      </Flex>
      <Flex justifyContent="flex-end" gap={5} mt={6}>
        <Button type="submit" colorScheme="teal">
          Add to Map
        </Button>
        <Button color="white" bg="#345E80" onClick={viewFile}>
          View File
        </Button>
      </Flex>
    </Flex>
  );
};

SuccessModalContent.propTypes = {
  setIsUploadingNewFile: PropTypes.func.isRequired,
  onEditViewFile: PropTypes.func.isRequired,
  isLoading: PropTypes.func.isRequired,
};

export default SuccessModalContent;
