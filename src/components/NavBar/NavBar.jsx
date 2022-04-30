import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';
import UploadCSV from '../UploadCSV/UploadCSV';

import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';

import { FYABackend } from '../../common/utils';
import { getCurrentUser, auth } from '../../common/auth_utils';

const NavBar = ({ isAdmin }) => {
  const [initials, setInitials] = useState('');

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
  }, [isAdmin]);

  const AdminLinks = () => (
    <>
      <NavLink
        to="/"
        className={navLink =>
          navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
        }
      >
        Admin Dashboard
      </NavLink>
      <NavLink
        to="/add-box-form"
        className={navLink =>
          navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
        }
      >
        Add Box
      </NavLink>
      <Button variant="unstyled" onClick={onUploadCSVOpenModal} className={styles['upload-button']}>
        Upload CSV
        <UploadCSV isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
      </Button>
      <NavLink
        to="/export-csv"
        className={navLink =>
          navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
        }
      >
        Export CSV
      </NavLink>
    </>
  );

  const UserLinks = () => (
    <>
      <NavLink
        to="/about"
        className={navLink =>
          navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
        }
      >
        About
      </NavLink>
      <NavLink
        to="/launch-box-form"
        className={navLink =>
          navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
        }
      >
        Launch a Box
      </NavLink>
      <NavLink
        to="/found-box-form"
        className={navLink =>
          navLink.isActive ? styles['nav-link-selected'] : styles['nav-link-unselected']
        }
      >
        Found a Box
      </NavLink>
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
          <div className={styles['navbar-buttons']}>{isAdmin ? <AdminLinks /> : <UserLinks />}</div>
          {isAdmin && (
            <NavLink to="/profile">
              <div className={styles['navbar-initials']}>{initials}</div>
            </NavLink>
          )}
        </div>
      </div>
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
