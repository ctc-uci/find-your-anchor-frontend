import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import BoxForm from '../../components/BoxForm/BoxForm';
import './AddBoxForm.css';

function AddBoxForm() {
  return (
    <ChakraProvider>
      <div className="addBoxForm">
        <h1>Add Box</h1>
        <BoxForm />
      </div>
    </ChakraProvider>
  );
}

export default AddBoxForm;
