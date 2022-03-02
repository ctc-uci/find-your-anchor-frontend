import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import RelocateBoxForm from '../../components/RelocateBoxForm/RelocateBoxForm';
import styles from './RelocateBoxFormPage.module.css';

const RelocateBoxFormPage = () => {
  return (
    <ChakraProvider>
      <h1 className={styles['relocate-page-title']}>Relocate Box</h1>
      <div>RelocateBoxFormPage.jsx</div>
      <RelocateBoxForm />
    </ChakraProvider>
  );
};

export default RelocateBoxFormPage;
