import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import BoxForm from '../../components/AddBoxForm/AddBoxForm';
import './AddBoxForm.css';

const AddBoxFormPage = () => {
  return (
    <ChakraProvider>
      <div className="add-box-form">
        <h1 className="add-box-form-title">Add Box</h1>
        <BoxForm />
      </div>
    </ChakraProvider>
  );
};

export default AddBoxFormPage;
