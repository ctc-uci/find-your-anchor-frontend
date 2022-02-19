import React from 'react';
import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';

import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';
import SendLinkModal from './SendLinkModal/SendLinkModal';

// TODO:
// - Remove ChakraProvider once provider is moved to index.js

const AdminProfilePage = () => {
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <div>
        <div className="sub-header">
          <Button onClick={onOpen} color="white" bg="#1F2F38" className="share-registration-box">
            Share Registration Link
          </Button>
          <SendLinkModal isOpen={isOpen} onClose={onClose} />

          <div className="welcome-header" colorScheme="blue">
            <h1>WELCOME!</h1>
          </div>

          <div className="logout-button">
            <Button colorScheme="teal" onClick={null}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Button colorScheme="red" onClick={onOpenDeleteModal}>
        Delete Account
      </Button>
      <DeleteAccountModal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} />
    </ChakraProvider>
  );
};

export default AdminProfilePage;
