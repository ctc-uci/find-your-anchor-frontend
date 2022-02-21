import React from 'react';
import { ChakraProvider, Button, useDisclosure, Input, Image } from '@chakra-ui/react';

import styles from './AdminProfilePage.module.css';
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
      <div className={styles['sub-header']}>
        <Button
          onClick={onOpen}
          color="white"
          className={styles['share-registration-box']}
          borderRadius="15px"
          bg="#1F2F38"
          fontSize="20px"
          size="md"
          width="260px"
        >
          Share Registration Link
        </Button>
        <SendLinkModal isOpen={isOpen} onClose={onClose} />

        <div className={styles['welcome-header']} colorScheme="blue">
          <h1>WELCOME!</h1>
        </div>

        <div className={styles['logout-button']}>
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

      <div className={styles['fya-logo-large']}>
        <img boxSize="100px" src={FYALogoLarge} alt="Find Your Anchor Logo" />
      </div>

      <div className={styles['background-box']}>
        <div className={styles['profile-name']}>
          <div className={styles['first-name-container']}>
            <h1>First Name:</h1>
            <div className={styles['name-input-container']}>
              <Input
                bg="#FFFFFF"
                className={styles['first-name-input']}
                size="lg"
                htmlSize={35}
                width="auto"
                top="5px"
              />
              <Image
                boxSize="27.75"
                className={styles['pen-image']}
                src={PenImage}
                alt="text input"
              />
            </div>
          </div>

          <div className={styles['last-name-container']}>
            <h1>Last Name:</h1>
            <div className={styles['name-input-container']}>
              <Input
                bg="#FFFFFF"
                className={styles['last-name-input']}
                size="lg"
                htmlSize={35}
                width="auto"
                top="5px"
              />
              <Image
                boxSize="27.75"
                className={styles['pen-image']}
                src={PenImage}
                alt="text input"
              />
            </div>
          </div>
        </div>

        <div className={styles['email-container']}>
          <h1>Email Address:</h1>
          <div className={styles['email-input-container']}>
            <Input
              bg="#FFFFFF"
              className={styles['email-input']}
              size="lg"
              htmlSize={95}
              width="auto"
            />
          </div>
        </div>

        <div className={styles['delete-account-button']}>
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
