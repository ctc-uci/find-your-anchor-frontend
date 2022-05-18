import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import LogoutModal from '../AdminProfile/LogoutModal/LogoutModal';
import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';
import { FYABackend } from '../../common/utils';
import { getCurrentUser, auth } from '../../common/auth_utils';
import useMobileWidth from '../../common/useMobileWidth';
import addBoxIcon from '../../assets/navBarIcons/add-box-icon.svg';
import dashboardIcon from '../../assets/navBarIcons/admin-dashboard-icon.svg';
import exportCSVIcon from '../../assets/navBarIcons/export-csv-icon.svg';
import hamburgerIcon from '../../assets/navBarIcons/hamburger-icon.svg';
import uploadCSVIcon from '../../assets/navBarIcons/upload-csv-icon.svg';
import userProfileIcon from '../../assets/navBarIcons/user-profile-icon.svg';
import logoutIcon from '../../assets/navBarIcons/logout-icon.svg';
import aboutIcon from '../../assets/navBarIcons/about-icon.svg';
import admingLoginIcon from '../../assets/navBarIcons/admin-login-icon.svg';
import foundBoxIcon from '../../assets/navBarIcons/found-box-icon.svg';
import launchBoxIcon from '../../assets/navBarIcons/launch-box-icon.svg';

const NavBar = ({ isAdmin }) => {
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

  const {
    isOpen: isLogoutOpenModal,
    onOpen: onLogoutOpenModal,
    onClose: onLogoutCloseModal,
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
    onMobileNavClose();
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
      path: '/',
      display: 'Dashboard',
      icon: dashboardIcon,
      mobileOnly: true,
    },
    {
      path: '/about',
      display: 'About',
      icon: aboutIcon,
    },
    {
      path: '/launch-box-form',
      display: 'Launch a Box',
      onClick: () => {
        navigate('/launch-box-form');
        window.location.reload(false);
      },
      icon: launchBoxIcon,
    },
    {
      path: '/found-box-form',
      onClick: () => {
        navigate('/found-box-form');
        window.location.reload(false);
      },
      display: 'Found a Box',
      icon: foundBoxIcon,
    },
    {
      path: '/login',
      display: 'Admin Login',
      icon: admingLoginIcon,
      mobileOnly: true,
    },
  ];
  const adminLinks = [
    {
      path: '/',
      display: 'Admin Dashboard',
      icon: dashboardIcon,
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
        onLogoutOpenModal();
      },
      icon: logoutIcon,
      mobileOnly: true,
    },
  ];
  const navElements = (isAdmin ? adminLinks : generalUserLinks).map(link =>
    (link.mobileOnly && !isMobile) || (link.desktopOnly && isMobile) ? (
      <></>
    ) : (
      (isMobile ? linkMobileElement : linkDesktopElement)(link)
    ),
  );

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
            navElements
          )}
        </Box>
      </Flex>
      <Modal isOpen={isMobileNavOpen && isMobile} onClose={onMobileNavClose} size="full">
        <ModalOverlay />
        <ModalContent className={styles['nav-modal']}>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" p="5">
              {navElements}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <UploadCSV isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
      <LogoutModal isOpen={isLogoutOpenModal} onClose={onLogoutCloseModal} />
    </ChakraProvider>
  );
};
NavBar.defaultProps = {
  isAdmin: false,
};
NavBar.propTypes = {
  isAdmin: PropTypes.bool,
};
export default NavBar;
