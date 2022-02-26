import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.css';

import NavBar from '../NavBar/NavBar';

const Layout = () => (
  <div>
    <div className={styles.navbar}>
      <NavBar />
    </div>
    <div className={styles.layout}>
      <Outlet />
    </div>
  </div>
);

export default Layout;
