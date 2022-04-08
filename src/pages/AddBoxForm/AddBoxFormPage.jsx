import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AddBoxForm from '../../components/AddBoxForm/AddBoxForm';
import styles from './AddBoxForm.module.css';

const AddBoxFormPage = () => {
  return (
    <ChakraProvider>
      <>
        <h1 className={styles['add-box-page-title']}>Add Box</h1>
        <AddBoxForm />
      </>
    </ChakraProvider>
  );
};

export default AddBoxFormPage;
