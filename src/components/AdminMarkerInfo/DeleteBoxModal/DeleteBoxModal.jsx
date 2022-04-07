import React from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/CommonModal/CommonModal';
import DeleteBoxModalContent from './DeleteBoxModalContent';

const DeleteBoxModal = ({ isOpen, onClose, deleteBox }) => {
  const closeModal = () => {
    onClose();
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={closeModal}
      showCloseButton
      closeOnOverlayClick
      width={448}
      height={196}
    >
      <DeleteBoxModalContent deleteBox={deleteBox} />
    </CommonModal>
  );
};

DeleteBoxModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deleteBox: PropTypes.func.isRequired,
};

export default DeleteBoxModal;
