import React from 'react';
import AddBoxForm from '../../components/AddBoxForm/AddBoxForm';
import styles from './AddBoxForm.module.css';

const AddBoxFormPage = () => {
  return (
    <>
      <h1 className={styles['add-box-page-title']}>Add Box</h1>
      <AddBoxForm />
    </>
  );
};

export default AddBoxFormPage;
