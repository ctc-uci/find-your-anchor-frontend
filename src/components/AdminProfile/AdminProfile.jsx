import React, { useState } from 'react';
import { PropTypes, instanceOf } from 'prop-types';
import { ChakraProvider, Button, useDisclosure, Input, Text } from '@chakra-ui/react';

import { RiPencilFill, RiCheckFill } from 'react-icons/ri';
import { DiReact } from 'react-icons/di';
import styles from './AdminProfile.module.css';
import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';
import SendLinkModal from './SendLinkModal/SendLinkModal';
import FYALogoLarge from '../../assets/fya-logo-large.svg';

import { logout, useNavigate } from '../../common/auth_utils';
import { Cookies, withCookies } from '../../common/cookie_utils';

const TextInput = ({ inputLabel, placeHolder, editable, editState, makeEditable }) => (
  <div className={styles['form-input']}>
    <Text>{inputLabel}</Text>
    <div className={styles['editable-input']}>
      <Input top="5px" size="lg" width="100%" placeholder={placeHolder} isDisabled={!editState} />
      <button type="button" style={editable ? {} : { visibility: 'hidden' }} onClick={makeEditable}>
        {editState ? (
          <RiCheckFill color="#38a169" size={35} />
        ) : (
          <RiPencilFill color="#8E8E8E" size={35} />
        )}
      </button>
    </div>
  </div>
);

const AdminProfile = ({ cookies }) => {
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

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const handleLogout = async () => {
    try {
      await logout('/login', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
      console.log(errorMessage);
    }
  };

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
          <div className={styles['logo-wrapper']}>
            <img className={styles['fya-logo']} src={FYALogoLarge} alt="Find Your Anchor Logo" />
          </div>
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
          <Button
            onClick={handleLogout}
            colorScheme="teal"
            bg="#345E80"
            fontSize="20px"
            size="lg"
            rightIcon={<DiReact />}
          >
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

AdminProfile.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(AdminProfile);
