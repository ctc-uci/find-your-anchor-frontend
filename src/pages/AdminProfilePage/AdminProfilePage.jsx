import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import AdminProfile from '../../components/AdminProfile/AdminProfile';
import styles from './AdminProfilePage.module.css';

const AdminProfilePage = () => {
  return (
    <ChakraProvider>
      <div className={styles['page-wrapper']}>
        <AdminProfile />
      </div>
    </ChakraProvider>
  );
};

export default AdminProfilePage;
