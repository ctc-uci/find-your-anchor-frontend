import React from 'react';
import './NavBar.css';

import FYALogo from '../../assets/fya-logo.png';

function NavBar() {
  return (
    <div className="nav-bar">
      <div className="fya-logo">
        <img src={FYALogo} alt="Find Your Anchor Logo" />
      </div>
      <div className="buttons-and-account">
        <p className="buttons">Add Box</p>
        <p className="buttons">Upload CSV </p>
        <p className="buttons">Export CSV</p>
        <div className="account">
          <span className="circle" />
          <p className="account-name">SA</p>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
