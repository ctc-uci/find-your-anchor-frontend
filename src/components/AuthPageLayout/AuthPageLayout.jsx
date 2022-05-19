import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import styles from './AuthPageLayout.module.css';
import FYALogo from '../../assets/fya-text-logo.svg';
import FYALogoMobile from '../../assets/fya-logo-large.svg';

const AuthPageLayout = ({ children, backgroundImage }) => {
  const navigate = useNavigate();

  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['auth-form']}>
          <div className={styles['auth-container']}>
            <div className={styles['logo-container']}>
              <button type="button" onClick={() => navigate('/')}>
                <img src={FYALogo} className={styles.logo} alt="logo" />
              </button>
            </div>
            <div className={styles['auth-form-component']}>{children}</div>
          </div>
        </div>
        <div className={styles.banner} style={{ backgroundImage: `url(${backgroundImage})` }}>
          <img src={FYALogoMobile} className={styles['logo-mobile']} alt="logo" />
        </div>
      </div>
    </ChakraProvider>
  );
};

AuthPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundImage: PropTypes.node.isRequired,
};

export default AuthPageLayout;
