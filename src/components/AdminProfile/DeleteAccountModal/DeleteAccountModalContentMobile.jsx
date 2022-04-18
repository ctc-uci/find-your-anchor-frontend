/* eslint-disable react/no-unescaped-entities */
import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import styles from './DeleteAccountModal.module.css';
import { FYABackend } from '../../../common/utils';
import { auth, getCurrentUser, logout } from '../../../common/auth_utils';
import { Cookies, withCookies } from '../../../common/cookie_utils';
import CommonConfirmationPage from '../../../common/CommonConfirmationPage/CommonConfirmationPage';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const DeleteAccountModalContentMobile = ({ cookies }) => {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleDelete = async () => {
    // Delete the user.
    const user = await getCurrentUser(auth);
    await FYABackend.delete(`/users/${user.uid}`);
    setOpenConfirmation(true);
    // Manually log out the user.
    await logout(cookies);
  };

  return (
    <div className={styles['step-content']}>
      <Text fontSize="18px" fontWeight="bold" className={styles['modal-header-text']}>
        Delete Account
      </Text>
      <Text fontSize="16px" className={styles['sub-text']}>
        Are you sure? You can't undo this action afterwards.
      </Text>
      <ButtonGroup size="lg" className={styles['step-button-group']}>
        <Button bg="#E2E8F0" fontSize="16px">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="white" bg="#E53E3E" fontSize="16px">
          Delete Account
        </Button>
        <CommonConfirmationPage
          isOpen={openConfirmation}
          confirmationTitle="Account Successfully Deleted"
        />
        <Link className={styles['return-to-login-link']} to="/login">
          Login
        </Link>
      </ButtonGroup>
    </div>
  );
};

DeleteAccountModalContentMobile.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(DeleteAccountModalContentMobile);
