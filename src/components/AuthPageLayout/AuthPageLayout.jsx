import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './AuthPageLayout.module.css';
import FYALogo from '../../assets/fya-text-logo.svg';
import FYALogoMobile from '../../assets/fya-logo-large.svg';

const AuthPageLayout = ({ children, backgroundImage }) => {
  return (
    <div className={styles['page-container']}>
      <div className={styles['auth-form']}>
        <div className={styles['auth-container']}>
          <div className={styles['logo-container']}>
            <Link to="/">
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </Link>
          </div>
          <div className={styles['auth-form-component']}>{children}</div>
        </div>
      </div>
      <div className={styles.banner} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={styles['logo-container-mobile']}>
          <Link to="/">
            <img src={FYALogoMobile} className={styles['logo-mobile']} alt="logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

AuthPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundImage: PropTypes.node.isRequired,
};

export default AuthPageLayout;
