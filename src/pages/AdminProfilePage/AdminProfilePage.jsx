import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import AdminProfile from '../../components/AdminProfile/AdminProfile';

const AdminProfilePage = () => {
  return (
    <ChakraProvider>
      <AdminProfile />
    </ChakraProvider>
  );
};

export default AdminProfilePage;
