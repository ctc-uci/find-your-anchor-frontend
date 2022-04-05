import React from 'react';
import PropTypes from 'prop-types';
import FYALogo from '../../assets/fya-text-logo.svg';
import FYALogoMobile from '../../assets/fya-logo-large.svg';
import styles from './CommonConfirmationPage.module.css';

const CommonConfirmationPage = ({ isOpen, children, showFYALogo }) => {
  if (isOpen) {
    return (
      <div className={styles['confirmation-page']}>
        {showFYALogo && <img src={FYALogo} className={styles.logo} alt="logo" />}
        {showFYALogo && <img src={FYALogoMobile} className={styles['logo-mobile']} alt="logo" />}
        {children}
      </div>
    );
  }
  return '';
};

CommonConfirmationPage.defaultProps = {
  showFYALogo: true,
};

CommonConfirmationPage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  showFYALogo: PropTypes.bool,
};

export default CommonConfirmationPage;
