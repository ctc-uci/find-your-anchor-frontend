import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import RelocateBoxForm from '../../components/RelocateBoxForm/RelocateBoxForm';
import styles from './RelocateBoxFormPage.module.css';

import BoxFormConfirmation from '../../components/BoxFormConfirmation/BoxFormConfirmation';

const RelocateBoxFormPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <ChakraProvider>
      {submitted ? (
        <BoxFormConfirmation pickup={false} />
      ) : (
        <>
          <h1 className={styles['relocate-page-title']}>Relocate Box</h1>
          <RelocateBoxForm setFormSubmitted={setSubmitted} />
        </>
      )}
    </ChakraProvider>
  );
};

export default RelocateBoxFormPage;
