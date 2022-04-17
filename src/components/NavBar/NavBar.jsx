import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  ChakraProvider,
  useDisclosure,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  SimpleGrid,
  Box,
  Icon,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  FaFileUpload,
  FaPlusSquare,
  FaFileCsv,
  FaUserAlt,
  FaInfoCircle,
  FaSearchLocation,
} from 'react-icons/fa';

import UploadCSV from '../UploadCSV/UploadCSV';
import useMobileWidth from '../../common/useMobileWidth';
import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';

import { FYABackend } from '../../common/utils';
import { getCurrentUser, auth } from '../../common/auth_utils';

const NavBar = ({ isAdmin }) => {
  const [initials, setInitials] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isUploadCSVOpenModal,
    onOpen: onUploadCSVOpenModal,
    onClose: onCloseUploadCSVOpenModal,
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
  }, [isAdmin, useMobileWidth]);

  const AdminLinks = () => (
    <>
      <Box>
        <NavLink
          onClick={onClose}
          to="/profile"
          className={navLink =>
            navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
          }
        >
          <div> {useMobileWidth() && <Icon as={FaUserAlt} />} Profile</div>
        </NavLink>
      </Box>
      <Box>
        <NavLink
          onClick={onClose}
          to="/add-box-form"
          className={navLink =>
            navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
          }
        >
          {useMobileWidth() && <Icon as={FaPlusSquare} />}Add Box
        </NavLink>
      </Box>
      <Box onClick={onUploadCSVOpenModal}>
        {useMobileWidth() && <Icon as={FaFileUpload} />} Upload CSV
        <UploadCSV isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
      </Box>
      <Box>
        <NavLink
          onClick={onClose}
          to="/export-csv"
          className={navLink =>
            navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
          }
        >
          {useMobileWidth() && <Icon as={FaFileCsv} />} Export CSV
        </NavLink>
      </Box>
    </>
  );

  const UserLinks = () => (
    <>
      <Box>
        <NavLink
          onClick={onClose}
          to="/about"
          className={navLink =>
            navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
          }
        >
          {useMobileWidth() && <Icon as={FaInfoCircle} />} About
        </NavLink>
      </Box>
      <Box>
        <NavLink
          onClick={onClose}
          to="/relocate-box-form"
          className={navLink =>
            navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
          }
        >
          {useMobileWidth() && <Icon as={FaPlusSquare} />} Launch a Box
        </NavLink>
      </Box>
      <Box>
        <NavLink
          onClick={onClose}
          to="/pickup-box-form"
          className={navLink =>
            navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
          }
        >
          {useMobileWidth() && <Icon as={FaSearchLocation} />} Found a Box
        </NavLink>
      </Box>
    </>
  );

  return (
    <ChakraProvider>
      <div className={styles['nav-bar']}>
        <NavLink to="/">
          <div className={styles['fya-logo']}>
            <img src={FYALogo} alt="Find Your Anchor Logo" />
          </div>
        </NavLink>
        <div className={styles['navbar-buttons-and-account']}>
          {!useMobileWidth() && (
            <div className={styles['navbar-buttons']}>
              {isAdmin ? <AdminLinks /> : <UserLinks />}
            </div>
          )}
          {!useMobileWidth() && isAdmin && (
            <NavLink to="/profile">
              <div className={styles['navbar-initials']}>{initials}</div>
            </NavLink>
          )}
          {useMobileWidth() && (
            <IconButton
              onClick={onOpen}
              className={styles['hamburger-icon']}
              icon={<HamburgerIcon />}
            />
          )}
        </div>
      </div>
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className={styles['nav-modal']}>
          <ModalHeader>Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className={styles['']}>
              <SimpleGrid minChildWidth="200px" spacing="40px">
                {isAdmin ? <AdminLinks /> : <UserLinks />}
              </SimpleGrid>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
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
