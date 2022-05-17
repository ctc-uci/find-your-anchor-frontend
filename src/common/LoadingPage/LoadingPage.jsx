import React from 'react';
import { Text } from '@chakra-ui/react';
import styles from './LoadingPage.module.css';
import FYALogoLarge from '../../assets/fya-logo-large.svg';

const LoadingPage = () => {
  return (
    <div className={styles['loading-page-outer']}>
      <div className={styles['loading-page']}>
        <img className={styles['fya-logo']} src={FYALogoLarge} alt="Find Your Anchor Logo" />
        <Text className={styles['loading-text']} size="xl" fontWeight="normal" textStyle="header-1">
          Loading
          <span className={styles.one}>.</span>
          <span className={styles.two}>.</span>
          <span className={styles.three}>.</span>
        </Text>
      </div>
    </div>
  );
};

export default LoadingPage;
