import React from 'react';
import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';

import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';

// TODO:
// - Remove ChakraProvider once provider is moved to index.js

const AdminProfilePage = () => {
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  return (
    <ChakraProvider>
      <div>
        <Button colorScheme="red" onClick={onOpenDeleteModal}>
          Delete Account
        </Button>
        <DeleteAccountModal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} />
      </div>
    </ChakraProvider>
  );
};

export default AdminProfilePage;
