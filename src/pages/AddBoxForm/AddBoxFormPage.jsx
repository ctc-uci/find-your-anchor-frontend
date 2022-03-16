import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import BoxForm from '../../components/AddBoxForm/AddBoxForm';
import styles from './AddBoxForm.module.css';

const AddBoxFormPage = () => {
  return (
    <ChakraProvider>
      <div className={styles['add-box-form']}>
        <h1 className={styles['add-box-form-title']}>Add Box</h1>
        <BoxForm />
      </div>
    </ChakraProvider>
  );
};

export default AddBoxFormPage;
