import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';
import UploadCSV from '../UploadCSV/UploadCSV';

import styles from './NavBar.module.css';
import FYALogo from '../../assets/fya-logo.png';
import PlaceHolderPFP from '../../assets/placeholder_pfp.svg';

const NavBar = ({ isAdmin }) => {
  const {
    isOpen: isUploadCSVOpenModal,
    onOpen: onUploadCSVOpenModal,
    onClose: onCloseUploadCSVOpenModal,
  } = useDisclosure();

  const AdminLinks = () => (
    <>
      <Link to="/add-box-form">Add Box</Link>
      <Button variant="unstyled" onClick={onUploadCSVOpenModal} className={styles['upload-button']}>
        Upload CSV
        <UploadCSV isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
      </Button>
      <Link to="/export-csv">Export CSV</Link>
    </>
  );

  const UserLinks = () => (
    <>
      <Link to="/">Relocate a Box</Link>
      <Link to="/">Pick Up a Box</Link>
    </>
  );

  return (
    <ChakraProvider>
      <div className={styles['nav-bar']}>
        <Link to="/">
          <div className={styles['fya-logo']}>
            <img src={FYALogo} alt="Find Your Anchor Logo" />
          </div>
        </Link>
        <div className={styles['navbar-buttons-and-account']}>
          <div className={styles['navbar-buttons']}>{isAdmin ? <AdminLinks /> : <UserLinks />}</div>
          <Link to="/profile">
            <div className={styles['navbar-account']}>
              <img className={styles['profile-picture']} src={PlaceHolderPFP} alt="Profile" />
            </div>
          </Link>
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
