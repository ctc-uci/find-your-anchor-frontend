import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/CommonModal/CommonModal';
import styles from './LogoutModal.module.css';
import FYALogo from '../../../assets/fya-logo-large.svg';

import useMobileWidth from '../../../common/FormUtils/useMobileWidth';
import LogoutDesktop from './LogoutModalContentDesktop';
import LogoutMobile from './LogoutModalContentMobile';

const LogoutModal = ({ isOpen, onClose }) => {
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
          <div className={styles['logout-modal-content']}>
            <LogoutMobile
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
          <div className={styles['logout-modal-content']}>
            <img src={FYALogo} alt="Logo" className={styles['fya-logo']} />
            <LogoutDesktop
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

LogoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LogoutModal;
