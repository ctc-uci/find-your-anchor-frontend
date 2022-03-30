import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, Stack } from '@chakra-ui/react';
import CommonModal from '../../../common/CommonModal/CommonModal';
import styles from './DeleteBoxModal.module.css';

const DeleteBoxModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} width={500} height={150}>
      <div className={styles['delete-modal-container']}>
        <Text fontSize="xl" fontWeight="bold" className={styles['delete-modal-text']}>
          Delete Box
        </Text>
        <Text fontSize="lg" className={styles['delete-modal-text']}>
          Are you sure? You can&apos;t undo this action afterwards
        </Text>
        <Stack direction="row" justify="right">
          <Button onClick={onClose} color="white" bg="#173848">
            Cancel
          </Button>
          <Button onClick={onDelete} color="white" bg="#E53E3E">
            Delete
          </Button>
        </Stack>
      </div>
    </CommonModal>
  );
};

DeleteBoxModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteBoxModal;
