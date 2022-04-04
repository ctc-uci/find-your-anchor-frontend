import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import styles from './AuthPageLayout.module.css';
import FYALogo from '../../assets/fya-text-logo.svg';

const AuthPageLayout = ({ children }) => {
  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['auth-form']}>
          <div className={styles['auth-container']}>
            <div className={styles['logo-container']}>
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </div>
            <div className={styles['auth-form-component']}>{children}</div>
          </div>
        </div>
        <div className={styles.banner} />
      </div>
    </ChakraProvider>
  );
};

AuthPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthPageLayout;
