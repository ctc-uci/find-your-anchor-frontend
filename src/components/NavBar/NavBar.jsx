import React, { useState, useEffect } from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ChakraProvider,
  useDisclosure,
  Link,
  Box,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  IconButton,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import UploadCSV from '../UploadCSV/UploadCSV';
import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';
import { FYABackend } from '../../common/utils';
import { getCurrentUser, auth, logout } from '../../common/auth_utils';
import { Cookies, withCookies } from '../../common/cookie_utils';
import useMobileWidth from '../../common/useMobileWidth';
import addBoxIcon from '../../assets/navBarIcons/add-box-icon.svg';
import adminDashboardIcon from '../../assets/navBarIcons/admin-dashboard-icon.svg';
import exportCSVIcon from '../../assets/navBarIcons/export-csv-icon.svg';
import hamburgerIcon from '../../assets/navBarIcons/hamburger-icon.svg';
import uploadCSVIcon from '../../assets/navBarIcons/upload-csv-icon.svg';
import userProfileIcon from '../../assets/navBarIcons/user-profile-icon.svg';
import logoutIcon from '../../assets/navBarIcons/logout-icon.svg';

const NavBar = ({ isAdmin, cookies }) => {
  const isMobile = useMobileWidth();
  const [initials, setInitials] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isOpen: isUploadCSVOpenModal,
    onOpen: onUploadCSVOpenModal,
    onClose: onCloseUploadCSVOpenModal,
  } = useDisclosure();
  const {
    isOpen: isMobileNavOpen,
    onOpen: onMobileNavOpen,
    onClose: onMobileNavClose,
  } = useDisclosure();
  const getUserInitials = async () => {
    const user = await getCurrentUser(auth);
    const backendUser = await FYABackend.get(`/users/userId/${user.uid}`);
    return (
      (backendUser.data.user.first_name ? backendUser.data.user.first_name[0] : '') +
      (backendUser.data.user.last_name ? backendUser.data.user.last_name[0] : '')
    );
  };
  useEffect(async () => {
    if (isAdmin) {
      const temp = await getUserInitials();
      setInitials(temp);
    }
    onCloseUploadCSVOpenModal();
  }, [isAdmin, location]);

  const linkDesktopElement = (linkData, hasIcon = false) => {
    return (
      <Link
        as={linkData.path && NavLink}
        to={linkData?.path}
        onClick={linkData?.onClick}
        className={styles['nav-link']}
        color={location.pathname === linkData.path ? '#126893' : 'black'}
        marginLeft={hasIcon && isMobile ? '5%' : isMobile && 0}
      >
        {linkData.display}
      </Link>
    );
  };
  const linkMobileElement = linkData => (
    <Flex direction="row" p="5">
      <img src={linkData.icon} alt="" /> {linkDesktopElement(linkData, true && linkData.icon)}
    </Flex>
  );
  const generalUserLinks = [
    {
      path: '/about',
      display: 'About',
    },
    {
      path: '/launch-box-form',
      display: 'Launch a Box',
    },
    {
      path: '/found-box-form',
      display: 'Found a Box',
    },
  ];
  const adminLinks = [
    {
      path: '/',
      display: 'Admin Dashboard',
      icon: adminDashboardIcon,
    },
    {
      path: '/add-box-form',
      display: 'Add Box',
      icon: addBoxIcon,
    },
    {
      display: 'Upload CSV',
      onClick: () => {
        if (!isMobile) {
          onUploadCSVOpenModal();
        } else {
          navigate('/upload-csv');
        }
      },
      icon: uploadCSVIcon,
    },
    {
      path: '/export-csv',
      display: 'Export CSV',
      icon: exportCSVIcon,
    },
    {
      path: '/profile',
      display: isMobile ? (
        'User Profile'
      ) : (
        <div className={styles['navbar-initials']}>{initials}</div>
      ),
      icon: userProfileIcon,
    },
    {
      display: 'Log out',
      onClick: async () => {
        await logout(cookies);
        navigate('/login');
      },
      icon: logoutIcon,
      mobileOnly: true,
    },
  ];
  const desktopNavElements = isAdmin
    ? adminLinks.map(link => (link.mobileOnly ? <></> : linkDesktopElement(link)))
    : generalUserLinks.map(link => (link.mobileOnly ? <></> : linkDesktopElement(link)));

  const mobileNavElements = isAdmin
    ? adminLinks.map(link => (link.desktopOnly ? <></> : linkMobileElement(link)))
    : generalUserLinks.map(link => (link.desktopOnly ? <></> : linkMobileElement(link)));
  return (
    <ChakraProvider>
      <Flex minWidth="100%" boxShadow="md" alignItems="center" gap="2">
        <Box p="1">
          <Link as={NavLink} to="/">
            <div className={styles['fya-logo']}>
              <img src={FYALogo} alt="Find Your Anchor Logo" />
            </div>
          </Link>
        </Box>
        <Spacer />
        <Box
          className={styles['nav-box']}
          maxWidth={isAdmin ? '533.25px' : '350px'}
          p={isMobile && 2}
        >
          {isMobile ? (
            <IconButton
              onClick={onMobileNavOpen}
              colorScheme="gray"
              aria-label="Navigation"
              icon={<img src={hamburgerIcon} alt="" />}
            />
          ) : (
            desktopNavElements
          )}
        </Box>
      </Flex>
      <Modal isOpen={isMobileNavOpen && isMobile} onClose={onMobileNavClose} size="full">
        <ModalOverlay />
        <ModalContent className={styles['nav-modal']}>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" p="5">
              {mobileNavElements}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <UploadCSV isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
    </ChakraProvider>
  );
};
NavBar.defaultProps = {
  isAdmin: false,
};
NavBar.propTypes = {
  isAdmin: PropTypes.bool,
  cookies: instanceOf(Cookies).isRequired,
};
export default withCookies(NavBar);
