import React from 'react';
import { Link } from 'react-router-dom';
import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';
import UploadCSV from '../UploadCSV/UploadCSV';

import './NavBar.css';
import FYALogo from '../../assets/fya-logo.png';

function NavBar() {
  const {
    isOpen: isUploadCSVOpenModal,
    onOpen: onUploadCSVOpenModal,
    onClose: onCloseUploadCSVOpenModal,
  } = useDisclosure();

  return (
    <ChakraProvider>
      <div className="nav-bar">
        <div className="fya-logo">
          <img src={FYALogo} alt="Find Your Anchor Logo" />
        </div>
        <div className="navbar-buttons-and-account">
          <Link className="navbar-buttons" to="/add-box-form">
            Add Box
          </Link>
          <Button variant="unstyled" onClick={onUploadCSVOpenModal} className="navbar-buttons">
            Upload CSV
            <UploadCSV isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
          </Button>
          <Link className="navbar-buttons" to="/export-csv">
            Export CSV
          </Link>
          <Link to="/profile">
            <div className="navbar-account">
              <span className="navbar-account-circle" />
              <p className="navbar-account-name">SA</p>
            </div>
          </Link>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default NavBar;
