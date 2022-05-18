import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes, { instanceOf } from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/provider';
import styles from './LogoutModal.module.css';
import { logout } from '../../../common/auth_utils';
import { Cookies, withCookies } from '../../../common/cookie_utils';
import useMobileWidth from '../../../common/useMobileWidth';
import ChakraTheme from '../../../common/ChakraTheme';

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
      <ChakraProvider theme={ChakraTheme}>
        <div className={styles['step-content']}>
          <Text fontSize="lg" fontWeight="bold" className={styles['modal-heading']}>
            Logout
          </Text>
          <Text fontSize="lg" className={styles['step-text']}>
            Are you sure you want to logout?
          </Text>
          <ButtonGroup size="md" className={styles['step-button-group']}>
            <Button onClick={closeModal} colorScheme="cancel" color="var(--color-text)">
              Cancel
            </Button>
            <Button onClick={handleLogout} colorScheme="button">
              Logout
            </Button>
          </ButtonGroup>
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['step-content']}>
        <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
          Are you sure you want to logout?
        </Text>
        <ButtonGroup size="lg" className={styles['step-button-group']}>
          <Button onClick={closeModal} colorScheme="cancel" color="var(--color-text)">
            Cancel
          </Button>
          <Button onClick={handleLogout} colorScheme="button">
            Logout
          </Button>
        </ButtonGroup>
      </div>
    </ChakraProvider>
  );
};

LogoutModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(LogoutModalContent);
