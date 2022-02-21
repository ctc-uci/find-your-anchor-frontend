import React from 'react';
import { ChakraProvider, Button, useDisclosure, Input, Image } from '@chakra-ui/react';

import './AdminProfilePage.css';
import DeleteAccountModal from '../../components/AdminProfilePage/DeleteAccountModal/DeleteAccountModal';
import SendLinkModal from '../../components/AdminProfilePage/SendLinkModal/SendLinkModal';
import FYALogoLarge from '../../assets/fya-logo-large.svg';
import PenImage from '../../assets/Vector.png';

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
      <div className="sub-header">
        <Button
          onClick={onOpen}
          color="white"
          className="share-registration-box"
          borderRadius="15px"
          bg="#1F2F38"
          fontSize="20px"
          size="md"
          width="260px"
        >
          Share Registration Link
        </Button>
        <SendLinkModal isOpen={isOpen} onClose={onClose} />

        <div className="welcome-header" colorScheme="blue">
          <h1>WELCOME!</h1>
        </div>

        <div className="logout-button">
          <Button
            onClick={null}
            colorScheme="teal"
            borderRadius="15px"
            bg="#345E80"
            size="lg"
            width="170px"
            fontSize="27px"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="fya-logo-large">
        <img boxSize="100px" src={FYALogoLarge} alt="Find Your Anchor Logo" />
      </div>

      <div className="background-box">
        <div className="profile-name">
          <div className="first-name-container">
            <h1>First Name:</h1>
            <div className="name-input-container">
              <Input
                bg="#FFFFFF"
                className="first-name-input"
                size="lg"
                htmlSize={35}
                width="auto"
                top="5px"
              />
              <Image boxSize="27.75" className="pen-image" src={PenImage} alt="text input" />
            </div>
          </div>

          <div className="last-name-container">
            <h1>Last Name:</h1>
            <div className="name-input-container">
              <Input
                bg="#FFFFFF"
                className="last-name-input"
                size="lg"
                htmlSize={35}
                width="auto"
                top="5px"
              />
              <Image boxSize="27.75" className="pen-image" src={PenImage} alt="text input" />
            </div>
          </div>
        </div>

        <div className="email-container">
          <h1>Email Address:</h1>
          <div className="email-input-container">
            <Input bg="#FFFFFF" className="email-input" size="lg" htmlSize={95} width="auto" />
          </div>
        </div>

        <div className="delete-account-button">
          <Button colorScheme="red" onClick={onOpenDeleteModal} size="lg" borderRadius="15px">
            Delete Account
          </Button>
          <DeleteAccountModal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default AdminProfilePage;
