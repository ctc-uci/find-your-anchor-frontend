import React, { useState } from 'react';
import RelocateBoxForm from '../../components/RelocateBoxForm/RelocateBoxForm';
import styles from './RelocateBoxFormPage.module.css';

import BoxFormConfirmation from '../../components/BoxFormConfirmation/BoxFormConfirmation';

const RelocateBoxFormPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {submitted ? (
        <BoxFormConfirmation pickup={false} />
      ) : (
        <>
          <h1 className={styles['relocate-page-title']}>Launch Box</h1>
          <RelocateBoxForm setFormSubmitted={setSubmitted} />
        </>
      )}
    </>
  );
};

export default RelocateBoxFormPage;
