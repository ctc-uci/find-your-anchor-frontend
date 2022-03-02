import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Button, useDisclosure, Input, Text } from '@chakra-ui/react';

import { RiPencilFill, RiCheckFill } from 'react-icons/ri';
import { DiReact } from 'react-icons/di';
import styles from './AdminProfilePage.module.css';
import DeleteAccountModal from '../../components/AdminProfilePage/DeleteAccountModal/DeleteAccountModal';
import SendLinkModal from '../../components/AdminProfilePage/SendLinkModal/SendLinkModal';
import FYALogoLarge from '../../assets/fya-logo-large.svg';

const TextInput = ({ inputLabel, placeHolder, editable, editState, makeEditable }) => (
  <div className={styles['form-input']}>
    <Text>{inputLabel}</Text>
    <div className={styles['editable-input']}>
      <Input top="5px" size="lg" width="100%" placeholder={placeHolder} isDisabled={!editState} />
      <button type="button" style={editable ? {} : { visibility: 'hidden' }} onClick={makeEditable}>
        {editState ? (
          <RiCheckFill color="#8E8E8E" size={35} />
        ) : (
          <RiPencilFill color="#8E8E8E" size={35} />
        )}
      </button>
    </div>
  </div>
);

const AdminProfilePage = () => {
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isOpenLinkModal,
    onOpen: onOpenLinkModal,
    onClose: onCloseLinkModal,
  } = useDisclosure();

  const [editFirst, setEditFirst] = useState(false);
  const [editLast, setEditLast] = useState(false);

  return (
    <ChakraProvider>
      <div className={styles['profile-page-wrapper']}>
        <div className={styles['top-buttons']}>
          <Button
            onClick={onOpenLinkModal}
            color="white"
            bg="#1F2F38"
            fontSize="20px"
            size="lg"
            rightIcon={<DiReact />}
          >
            Share Registration Link
          </Button>
          <SendLinkModal isOpen={isOpenLinkModal} onClose={onCloseLinkModal} />
        </div>
        <div className={styles['profile-form']}>
          <img
            className={styles['fya-logo-large']}
            src={FYALogoLarge}
            alt="Find Your Anchor Logo"
          />
          <TextInput
            inputLabel="First Name"
            placeHolder="Jane"
            editable
            editState={editFirst}
            makeEditable={() => setEditFirst(!editFirst)}
          />
          <TextInput
            inputLabel="Last Name"
            placeHolder="Doe"
            editable
            editState={editLast}
            makeEditable={() => setEditLast(!editLast)}
          />
          <TextInput inputLabel="Email" placeHolder="name@findyouranchor.us" editState={false} />
        </div>
        <div className={styles['bottom-buttons']}>
          <Button onClick={onOpenDeleteModal} colorScheme="red" size="lg" rightIcon={<DiReact />}>
            Delete Account
          </Button>
          <Button colorScheme="teal" bg="#345E80" fontSize="20px" size="lg" rightIcon={<DiReact />}>
            Logout
          </Button>
          <DeleteAccountModal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal} />
        </div>
      </div>
    </ChakraProvider>
  );
};

TextInput.defaultProps = {
  editable: false,
  editState: false,
  makeEditable: null,
};

TextInput.propTypes = {
  inputLabel: PropTypes.string.isRequired,
  placeHolder: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  editState: PropTypes.bool,
  makeEditable: PropTypes.func,
};

export default AdminProfilePage;
