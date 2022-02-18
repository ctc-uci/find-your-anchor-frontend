import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import BoxForm from '../../components/BoxForm/BoxForm';
import './AddBoxForm.css';

const AddBoxForm = () => {
  return (
    <ChakraProvider>
      <div className="add-box-form">
        <h1 className="add-box-form-title">Add Box</h1>
        <BoxForm />
      </div>
    </ChakraProvider>
  );
};

export default AddBoxForm;
