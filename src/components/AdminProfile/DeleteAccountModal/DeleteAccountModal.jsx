import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/CommonModal/CommonModal';
import styles from './DeleteAccountModal.module.css';
import FYALogo from '../../../assets/fya-logo-large.svg';

import useMobileWidth from '../../../common/FormUtils/useMobileWidth';
import DeleteAccountDesktop from './DeleteAccountModalContentDesktop';
import DeleteAccountMobile from './DeleteAccountModalContentMobile';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const isMobile = useMobileWidth();
  const [modalStep, setModalStep] = useState(0);

  const closeModal = () => {
    setModalStep(0);
    onClose();
  };

  return (
    <>
      {isMobile ? (
        <CommonModal
          isOpen={isOpen}
          onClose={closeModal}
          modalClassName={styles.modal}
          showCloseButton={modalStep === 0}
          closeOnOverlayClick={modalStep === 0}
          width={5}
          height={3}
        >
          <div className={styles['delete-modal-content']}>
            <DeleteAccountMobile
              modalStep={modalStep}
              setModalStep={setModalStep}
              closeModal={closeModal}
            />
          </div>
        </CommonModal>
      ) : (
        <CommonModal
          isOpen={isOpen}
          onClose={closeModal}
          modalClassName={styles.modal}
          showCloseButton={modalStep === 0}
          closeOnOverlayClick={modalStep === 0}
        >
          <div className={styles['delete-modal-content']}>
            <img src={FYALogo} alt="Logo" className={styles['fya-logo']} />
            <DeleteAccountDesktop
              modalStep={modalStep}
              setModalStep={setModalStep}
              closeModal={closeModal}
            />
          </div>
        </CommonModal>
      )}
    </>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountModal;
