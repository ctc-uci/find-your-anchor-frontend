import React from 'react';
import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';

import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';

const AdminProfilePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <div>
        <Button colorScheme="red" onClick={onOpen}>
          Delete Account
        </Button>
        <DeleteAccountModal isOpen={isOpen} onClose={onClose} />
      </div>
    </ChakraProvider>
  );
};

export default AdminProfilePage;
