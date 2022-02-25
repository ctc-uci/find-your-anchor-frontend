import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import PickupBoxForm from '../../components/PickupBoxForm/PickupBoxForm';
import './PickupBoxFormPage.css';

const PickupBoxFormPage = () => {
  return (
    <ChakraProvider>
      <div>
        <h1 className="pickup-box-form-title">Pick Up Box</h1>
        <PickupBoxForm />
      </div>
    </ChakraProvider>
  );
};

export default PickupBoxFormPage;
