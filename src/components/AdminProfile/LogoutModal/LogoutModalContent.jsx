import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes, { instanceOf } from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import styles from './LogoutModal.module.css';
import { logout } from '../../../common/auth_utils';
import { Cookies, withCookies } from '../../../common/cookie_utils';
import useMobileWidth from '../../../common/useMobileWidth';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const LogoutModalContent = ({ closeModal, cookies }) => {
  const isMobile = useMobileWidth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Log out the user.
    await logout(cookies);
    navigate('/login');
  };

  if (isMobile) {
    return (
      <div className={styles['step-content']}>
        <Text fontSize="lg" fontWeight="bold" className={styles['modal-heading']}>
          Logout
        </Text>
        <Text fontSize="lg" className={styles['step-text']}>
          Are you sure you want to logout?
        </Text>
        <ButtonGroup size="md" className={styles['step-button-group']}>
          <Button onClick={closeModal} color="#2D3748" bg="#E2E8F0">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="white" bg="#345E80">
            Logout
          </Button>
        </ButtonGroup>
      </div>
    );
  }
  return (
    <div className={styles['step-content']}>
      <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
        Are you sure you want to logout?
      </Text>
      <ButtonGroup size="lg" className={styles['step-button-group']}>
        <Button onClick={closeModal} color="#2D3748" bg="#E2E8F0">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="white" bg="#345E80">
          Logout
        </Button>
      </ButtonGroup>
    </div>
  );
};

LogoutModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(LogoutModalContent);
