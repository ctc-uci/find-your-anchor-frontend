import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/CommonModal/CommonModal';
import DeleteAccountModalContent from './DeleteAccountModalContent';
import styles from './DeleteAccountModal.module.css';
import FYALogo from '../../../assets/fya-logo-large.svg';

// TODO:
// - Replace ChakraUI Modal with common component once created
// - Implement deleteAccount

const deleteAccount = () => {
  // Make request to delete account here
  // eslint-disable-next-line no-console
  console.log('account deleted');
};

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(0);

  const closeModal = () => {
    setModalStep(0);
    onClose();
  };

  return (
    <CommonModal isOpen={isOpen} onClose={closeModal} modalClassName={styles.modal}>
      <div className={styles['delete-modal-content']}>
        <img src={FYALogo} alt="Logo" className={styles['fya-logo']} />
        <DeleteAccountModalContent
          modalStep={modalStep}
          setModalStep={setModalStep}
          closeModal={closeModal}
          deleteAccount={deleteAccount}
        />
      </div>
    </CommonModal>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountModal;
