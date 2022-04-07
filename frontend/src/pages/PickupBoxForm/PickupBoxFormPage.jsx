import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import PickupBoxForm from '../../components/PickupBoxForm/PickupBoxForm';
import styles from './PickupBoxFormPage.module.css';
import BoxFormConfirmation from '../../components/BoxFormConfirmation/BoxFormConfirmation';

const PickupBoxFormPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <ChakraProvider>
      {submitted ? (
        <BoxFormConfirmation pickup />
      ) : (
        <div>
          <h1 className={styles['pickup-box-form-title']}>Pick Up Box</h1>
          <PickupBoxForm setFormSubmitted={setSubmitted} />
        </div>
      )}
    </ChakraProvider>
  );
};

export default PickupBoxFormPage;
